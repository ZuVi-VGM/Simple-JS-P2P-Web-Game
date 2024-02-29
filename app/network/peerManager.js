import {Peer} from "https://esm.sh/peerjs@1.5.2?bundle-deps"
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
            const checkId = () => {
                if (this.peer_id) {
                    resolve(this.peer_id);
                } else {
                    setTimeout(checkId, 100);
                }
            };
    
            checkId();
        });
    }

    connectToPeer(peerId) {
        const conn = this.peer.connect(peerId);

        conn.on('open', () => {
            console.log('Connection started with:', peerId);
            this.handleIncomingConnection(conn);
            this.emitter.emit('newConnection', conn);
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
        conn.close();
    }
}

export default PeerManager;