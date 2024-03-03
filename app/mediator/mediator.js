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
        });

        this.peer.emitter.on('newConnection', (conn) => {
            if(!this.game.addUser(conn)) {
                setTimeout(() => {
                    this.messageHandler.sendMessage(conn, 'Connection Refused, game started!');
                    this.peer.closeConnection(conn);
                }, 500);
            }
        });

        this.peer.emitter.on('connectionClosed', (conn) => {
            this.game.deleteUser(conn.peer);
        });

        window.addEventListener('beforeunload', (event) => this.handleBeforeUnload(event));
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

            return tokenObj['data']['token'];
        } catch(error) {
            console.error("Error initializing game:", error);
            this.game.isHost = false;
            return false;
        }
    }

    async initConnection(token){
        //Get Peer_Id from Token
        //Connect and init connection
        try{
            //Validate Token
            const tokenObj = await this.auth.get('token/validate/' + token);
            if(tokenObj['data']['error'])
                throw new Error('Invalid Token!');

            //Try to connect to host
            if(!this.peer.connectToPeer(tokenObj['data']['payload']['peer_id']))
                throw new Error('Error during connection!');
            
            this.game.updateStatus();
            return true;
        } catch(error) {
            console.error("Error initializing game:", error);
            this.game.isHost = false;
            return false;
        }
    }
}

export default Mediator;