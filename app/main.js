import EncryptionService from './services/encryptionService.js'; //debug
import AuthenticationService from './services/authService.js'; //debug
import Mediator from './mediator/mediator.js';

import {render} from 'preact';
import { html } from 'htm/preact';
import App from './app.js';

const mediator = new Mediator();

// Init Encryption Service (Crypto Utility for E2E communication)
window.encryptionService = new EncryptionService(); //lo sistemiamo a breve
window.auth = new AuthenticationService();

// Connect to another peer
//peerConnection.connectToPeer('peerId123');

// Send message
//const messageData = { text: 'Ciao, mondo!' };
//messageHandler.sendMessage(peerConnection, messageData);
(async () => {
    render(html`<p>Loading... if this page won't load try reloading or accessing in desktop mode.</p>`, document.querySelector('#app'));

    if(await mediator.peer.getId())
        render(html`<${App} mediator=${mediator} />`, document.querySelector('#app'));
    else
        render(html`<p>Error, try accessing desktop mode.</p>`, document.querySelector('#app'));  
})();


/*
peerConnection.getId().then(id => {
    console.log('ID:', id);
});
*/

//TODO: Write room generator
