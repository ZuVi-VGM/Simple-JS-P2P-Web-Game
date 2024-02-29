import { html } from 'htm/preact';
import { Route, Link, Switch } from "wouter-preact";
import HomePage from './components/homepage.js';
import Game from './components/game.js';

const App = ({ mediator }) => {
    return (html`
            <!-- <nav>
                <ul>
                    <li><${Link} href="/">Home</${Link}></li>
                    <li><${Link} href="/game">Game</${Link}></li>
                </ul>
            </nav> -->

            <${Switch}>
                <${Route} path="/">
                    <${HomePage} mediator=${mediator} />
                </${Route}>
                <${Route} path="/game/:token?">
                    <${Game} mediator=${mediator} />
                </${Route}>                
                <!-- Default route in a switch -->
                <${Route}>404: No such page!<//>
            </${Switch}>
        `
    );
};

export default App;