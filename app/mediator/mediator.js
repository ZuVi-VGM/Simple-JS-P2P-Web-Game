class Mediator {
    constructor(PeerManager, MessageHandler, Game) {
        this.peer = PeerManager;
        this.messageHandler = MessageHandler;
        this.game = Game;

        this.peer.emitter.on('dataReceived', (data) => {
            this.messageHandler.handleMessage(data);
        });

        this.peer.emitter.on('newConnection', (conn) => {
            this.game.addUser(conn); //TODO: Check or refuse conection
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



}

export default Mediator;