import PeerManager from './network/peerManager.js';
import MessageHandler from './network/messageHandler.js';

// Crea una connessione P2P
window.peerConnection = new PeerManager();

// Crea un gestore dei messaggi
window.messageHandler = new MessageHandler();

// Esempio di connessione a un altro peer
// peerConnection.connectToPeer('peerId123');

// Esempio di invio di un messaggio
//const messageData = { text: 'Ciao, mondo!' };
//messageHandler.sendMessage(peerConnection, messageData);
peerConnection.getId().then(id => {
    console.log('ID:', id);
});

//TODO: Write room generator