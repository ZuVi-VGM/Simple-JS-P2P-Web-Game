import {Peer} from "peerJS"
import EventEmitter from "../utils/eventEmitter.js";

class PeerManager 
{
    constructor(){
        this.peer = new Peer();
        this.emitter = new EventEmitter();

        this.peer.on('open', (id) => {
            console.log('Peer ID:', id);
            this.peer_id = id;
        });

        this.peer.on('connection', (conn) => {
            console.log('Connection received from:', conn.peer);
            this.handleIncomingConnection(conn);
            this.emitter.emit('newConnection', conn);
        });
    }

    async getId() {
        return new Promise((resolve, reject) => {
            const checkId = (i) => {
                if(i == 99)
                    reject(false);
                if (this.peer_id) {
                    resolve(this.peer_id);
                } else {
                    setTimeout(() => checkId(i+1), 100);
                }
            };
    
            checkId(0);
        });
    }

    async connectToPeer(peerId) {
        // const conn = this.peer.connect(peerId);

        // conn.on('open', () => {
        //     console.log('Connection started with:', peerId);
        //     this.handleIncomingConnection(conn);
        //     this.emitter.emit('newConnection', conn);
        // });

        // return conn.open;
        return new Promise((resolve, reject) => {
            const conn = this.peer.connect(peerId);
            // Variabile per controllare se l'evento 'open' è stato emesso
            let isOpenEventEmitted = false;

            // Avviamo un timer di 5 secondi per controllare conn.open se l'evento 'open' non è stato emesso
            const timeout = setTimeout(() => {
                if (!isOpenEventEmitted && !conn.open) {
                    console.error('Connection not opened within 20 seconds.');
                    reject(false);
                }
            }, 20000);

    
            conn.on('open', () => {
                console.log('Connection started with:', peerId);
                this.handleIncomingConnection(conn);
                this.emitter.emit('newConnection', conn);
                isOpenEventEmitted = true;
                clearTimeout(timeout); // Cancella il timer se l'evento 'open' è stato emesso
                resolve(true);
            });
    
            conn.on('error', (err) => {
                console.error('Error connecting to peer:', err);
                clearTimeout(timeout); // Cancella il timer in caso di errore
                reject(false);
            });
        });
    }

    handleIncomingConnection(conn) {
        conn.on('data', (data) => {
            //Sendind data to MessageHandler module using an event
            this.emitter.emit('dataReceived', data);
        });

        conn.on('close', () => {
            console.log('Connection closed with:', conn.peer);
            this.emitter.emit('connectionClosed', conn);
        });
  
    }

    closeConnection(conn){
        if(conn && typeof conn === 'object')
            if(conn.open)
                conn.close();
    }
}

export default PeerManager;