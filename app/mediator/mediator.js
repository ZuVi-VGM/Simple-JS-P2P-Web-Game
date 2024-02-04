class Mediator {
    constructor(PeerManager, MessageHandler) {
        this.peer = PeerManager;
        this.messageHandler = MessageHandler;

        this.peer.emitter.on('dataReceived', (data) => {
            this.messageHandler.handleMessage(data);
        });
    }
}

export default Mediator;