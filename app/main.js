import PeerManager from './network/peerManager.js';
import MessageHandler from './network/messageHandler.js';
import EncryptionService from './services/encryptionService.js';

//TODO: remove window. and use const (debug purpose only) 
// Init P2P Connection Manager
window.peer = new PeerManager();

// Init Message Handler
window.messageHandler = new MessageHandler();

// Init Encryption Service (Crypto Utility for E2E communication)
window.encryptionService = new EncryptionService();

// Connect to another peer
//peerConnection.connectToPeer('peerId123');

// Send message
//const messageData = { text: 'Ciao, mondo!' };
//messageHandler.sendMessage(peerConnection, messageData);
(async () => {
    console.log(await peer.getId());
})();

/*
peerConnection.getId().then(id => {
    console.log('ID:', id);
});
*/

//TODO: Write room generator
