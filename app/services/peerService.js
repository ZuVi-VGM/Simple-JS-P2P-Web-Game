import {Peer} from "https://esm.sh/peerjs@1.5.2?bundle-deps"

class PeerConnection 
{
    constructor(){
        this.peer = new Peer();

        this.peer.on('open', (id) => {
            console.log('Peer ID:', id);
            this.peer_id = id;
        });

        this.peer.on('connection', (conn) => {
            console.log('Connessione ricevuta:', conn.peer);
            this.handleIncomingConnection(conn);
            this.conn = conn;
        });
    }

    getId() {
        return new Promise((resolve, reject) => {
            const checkId = () => {
                if (this.peer_id) {
                    resolve(this.peer_id);
                } else {
                    setTimeout(checkId, 100); // Controlla ogni 100 millisecondi
                }
            };
    
            checkId();
        });
    }

    connectToPeer(peerId) {
        const conn = this.peer.connect(peerId);

        conn.on('open', () => {
            // here you have conn.id
            console.log('Connessione avviata con:', peerId);
            this.conn = conn;
            this.handleIncomingConnection(conn);
          });
    }

    handleIncomingConnection(conn) {
        conn.on('data', (data) => {
            console.log('Dati ricevuti:', data);
            // Invia i dati a un modulo per la gestione dei messaggi
            messageHandler.handleMessage(data);
        });
    }
}

export default PeerConnection;