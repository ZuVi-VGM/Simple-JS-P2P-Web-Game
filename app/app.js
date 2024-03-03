import { html } from 'htm/preact';
import { Route, Link, Switch, Redirect } from "wouter-preact";
import HomePage from './components/homepage.js';
import Game from './components/game.js';

const App = ({ mediator }) => {
    //For debugging purpose
    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    const token = urlParams.get('token');

    return (html`
            <!-- <nav>
                <ul>
                    <li><${Link} href="/">Home</${Link}></li>
                    <li><${Link} href="/game">Game</${Link}></li>
                </ul>
            </nav> -->

            <${Switch}>
                <${Route} path="/index.html">
                    <${Redirect} to="/game/${token}" />
                </${Route}>
                <${Route} path="/">
                    <${HomePage} mediator=${mediator} />
                </${Route}>
                <${Route} path="/game/:token?">
                    <${Game} mediator=${mediator} />
                </${Route}>                
                <!-- Default route in a switch -->
                <${Route}>404: No such page!</${Route}>
            </${Switch}>
        `
    );
};

export default App;