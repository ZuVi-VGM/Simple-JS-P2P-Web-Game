import {Peer} from "https://esm.sh/peerjs@1.5.2?bundle-deps"

class PeerManager 
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
            // here you have conn.id
            console.log('Connessione avviata con:', peerId);
            this.handleIncomingConnection(conn);
        });
    }

    handleIncomingConnection(conn) {
        conn.on('data', (data) => {
            console.log('Dati ricevuti:', data);
            // Send data to MessageHandler module
            MessageHandler.handleMessage(data);
        });

        conn.on('close', () => {
            console.log('Connessione chiusa con:', conn.peer);
            this.conn = null;
        });

        //maybe not so good
        this.conn = conn;
    }

    closeConnection(conn){
        //must use conn to handle multiple peer connected.
        this.conn.close();
        this.conn = null;
    }
}

export default PeerManager;