import PeerConnection from './services/peerService.js';
import MessageHandler from './services/messageService.js';

// Crea una connessione P2P
window.peerConnection = new PeerConnection();

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