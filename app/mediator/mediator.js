import PeerManager from '../network/peerManager.js';
import MessageHandler from '../network/messageHandler.js';
import EncryptionService from "../services/encryptionService.js";
import AuthenticationService from "../services/authService.js";
import Game from '../models/game.js';

class Mediator {
    constructor() {
        this.peer = new PeerManager;
        this.messageHandler = new MessageHandler;
        this.game = new Game;
        this.encryption = new EncryptionService;
        this.auth = new AuthenticationService;

        this.peer.emitter.on('dataReceived', (data) => {
            this.messageHandler.handleMessage(data);

            switch(data['action']){
                case 'authenticate':
                    this.setUserName(data);
                    break;
                case 'update_users':
                    this.game.updateUsersList(data['payload']);
                    break;
                case 'delete_user':
                    this.game.deleteUser(data['peer']);
                    break;
                case 'start_game':
                    this.startGame(data);
                    break;
                case 'new_message':
                    this.addMessage(data);
                    break;
                case 'give_point':
                    this.givePoint(data);
                    break;
                case 'game_end':
                    this.endGame(data);
                    break;
                // default: //maybe handle case where action is not defined?
                //     this.messageHandler.handleMessage(data);
            }
        });

        this.peer.emitter.on('newConnection', (conn) => {
            if(!this.game.addUser(conn)) {
                setTimeout(() => {
                    this.messageHandler.sendMessage(conn, 'Connection Refused, game started!'); //TODO: maybe remove this and handle game started
                    this.peer.closeConnection(conn);
                }, 500);
            }
        });

        this.peer.emitter.on('connectionClosed', (conn) => {
            this.game.deleteUser(conn.peer);
            this.notifyAll({'action': 'delete_user', 'peer': conn.peer});
        });

        window.addEventListener('beforeunload', (event) => this.handleBeforeUnload(event));
    }

    notifyAll(data){
        if(!this.game.isHost)
            return;

        if (Object.keys(this.game.users).length > 0) {
            Object.values(this.game.users).forEach(user => {
                if(user.connection.peer)
                    this.messageHandler.sendMessage(user.connection, data);
            });
        }
    }

    setUserName(data){
        this.game.users[data['peer_id']].setName(data['value']);
        this.notifyAll({'action': 'update_users', 'payload': this.game.getUserData()});
        this.game.notify();
    }

    handleBeforeUnload(event){
        event.preventDefault();
        event.returnValue = ''; // Per supportare la vecchia sintassi di IE
        
        if (Object.keys(this.game.users).length > 0) {
            Object.values(this.game.users).forEach(user => {
                this.peer.closeConnection(user.connection);
            });
        }
    }

    sendMessage(message)
    {
        let data = {'action': 'new_message', 'text': message, 'peer_id': this.peer.peer_id};
        if(!this.game.isHost)
            this.messageHandler.sendMessage(this.game.users[this.game.host].connection, data);
        else
            this.addMessage(data);
    }

    addMessage(data){
        if(!this.game.started)
            return;

        this.game.message = {'text': data['text'], 'sender': false, 'correct': false};

        if(data['peer_id'] == this.peer.peer_id)
            this.game.message['sender'] = true;
        if(data['text'].toLowerCase() == this.game.curr_word['parola'].toLowerCase())
            this.game.message['correct'] = true;
        
        this.notifyAll(data);
        this.game.notify(); 

        if(this.game.isHost)
            this.checkForWin(data);       
    }

    checkForWin(data){
        if(data['text'].toLowerCase() == this.game.curr_word['parola'].toLowerCase())
            this.victory(data['peer_id']);
    }

    givePoint(data){
        this.game.curr_word = data['word'];
        this.game.givePoint(data['peer_id']);
    }

    startGame(data = null){
        if(this.game.isHost){
            if(this.game.words.length == 0)
                this.game.generateWords();
            this.game.curr_word = this.game.words.pop();
            this.notifyAll({'action':'start_game', 'word': this.game.curr_word}); //TODO: send also a timestamp to sincronize
        }
        else
            this.game.curr_word = data['word'];

        this.game.startGame();           
    }

    victory(peer_id){
        if(this.game.isHost){
            if(this.game.words.length > 0){
                this.game.curr_word = this.game.words.pop();
                this.notifyAll({'action':'give_point', 'peer_id':peer_id, 'word': this.game.curr_word});
                
            } else {
                this.notifyAll({'action':'game_end', 'peer_id': peer_id});
                this.game.started = false; //Handle this case
            }
        }

        if(!this.game.givePoint(peer_id))
            this.game.givePoint('host');
    }

    endGame(data){
        this.game.givePoint(data['peer_id']);
        this.game.started = false;
        this.game.notify();
    }


    async createNewGame(username, password){
        //Use password to initialize the game:
        //create salt and key for hmac - DONE
        //save myid - DONE
        //create RSA keys - DONE
        //create token - DONE
        try
        {
            await this.encryption.generateHmacKey(password);
            //create token
            const tokenObj = await this.auth.post('token/create', {'peer_id': this.peer.peer_id, 'salt': this.encryption.hmacObj['salt']});

            //console.log(tokenObj['data']['token']);
            //console.log(this.game.users);

            this.game.isHost = true;
            if(!this.game.addHost(this.peer.peer_id, username))
                throw new Error('Cannot add host, check for correct username!');

            await this.encryption.init('rsa');
            if(!this.game.setPubKey(this.encryption.keyPair.publicKey))
                throw new Error('Cannot add host, problem with RSA Key!');
            
            this.game.createNewGame();
            return tokenObj['data']['token'];
        } catch(error) {
            console.error("Error initializing game:", error);
            this.game.isHost = false;
            return false;
        }
    }

    async initConnection(token, username){

        //Create connection and authenticate
            //Init connection
            //Init e2e -> future implementation
            //Then authenticate
        
        try{
            const connectionSuccessful = await this.peer.connectToPeer(token['peer_id']);
            if(!connectionSuccessful)
                return false;

            this.game.host = token['peer_id'];
            let query = {'action': 'authenticate', 'value': username, 'peer_id': this.peer.peer_id};
            
            this.messageHandler.sendMessage(this.game.users[token['peer_id']].connection, query);
            //this.game.updateStatus();
            return true;  
        } catch (err) {
            console.error('Errore durante l\'inizializzazione della connessione:', err);
            return false;
        }
    }

    async validateToken(token){
        //Get Peer_Id from Token
        //Connect and init connection
        try{
            //Validate Token
            const tokenObj = await this.auth.get('token/validate/' + token);
            if(tokenObj['data']['error'])
                throw new Error('Invalid Token!');

            return tokenObj['data']['payload'];
        } catch(error) {
            console.error("Error validating token:", error);
            return false;
        }
    }
}

export default Mediator;