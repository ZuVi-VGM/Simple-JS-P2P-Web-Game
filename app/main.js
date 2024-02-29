import PeerManager from './network/peerManager.js';
import MessageHandler from './network/messageHandler.js';
import EncryptionService from './services/encryptionService.js';
import AuthenticationService from './services/authService.js';
import Mediator from './mediator/mediator.js';
import Game from './models/game.js';

import {render} from 'preact';
import { html } from 'htm/preact';
import App from './app.js';

const mediator = new Mediator(new PeerManager, new MessageHandler, new Game);

// Init Encryption Service (Crypto Utility for E2E communication)
window.encryptionService = new EncryptionService(); //lo sistemiamo a breve
window.auth = new AuthenticationService();

// Connect to another peer
//peerConnection.connectToPeer('peerId123');

// Send message
//const messageData = { text: 'Ciao, mondo!' };
//messageHandler.sendMessage(peerConnection, messageData);
(async () => {
    console.log(await mediator.peer.getId());
})();

render(html`<${App} mediator=${mediator} />`, document.querySelector('#app'));
/*
peerConnection.getId().then(id => {
    console.log('ID:', id);
});
*/

//TODO: Write room generator
