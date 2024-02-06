class Mediator {
    constructor(PeerManager, MessageHandler) {
        this.peer = PeerManager;
        this.messageHandler = MessageHandler;
        this.connections = {};

        this.peer.emitter.on('dataReceived', (data) => {
            this.messageHandler.handleMessage(data);
        });

        this.peer.emitter.on('newConnection', (conn) => {
            this.connections[conn.peer] = conn;
        });

        this.peer.emitter.on('connectionClosed', (conn) => {
            delete this.connections[conn.peer];
        });

        window.addEventListener('beforeunload', (event) => this.handleBeforeUnload(event));
    }

    handleBeforeUnload(event){
        event.preventDefault();
        event.returnValue = ''; // Per supportare la vecchia sintassi di IE
        
        if (Object.keys(this.connections).length > 0) {
            Object.values(this.connections).forEach(value => {
                this.peer.closeConnection(value);
            });
        }
    }

}

export default Mediator;