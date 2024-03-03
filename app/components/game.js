import { html } from 'htm/preact';
import { useEffect, useState, useRef } from 'preact/hooks';
import { useLocation } from 'wouter-preact';

const Game = ({ mediator }) => {
    const [loading, setLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [authenticated, setAuthenticated] = useState(mediator.game.isHost);
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const [messages, setMessages] = useState([
        { text: 'Messaggio Ricevuto' },
        { text: 'Messaggio Inviato', sender: true }
    ]);
    
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const [userList, setUsers] = useState(Object.values(mediator.game.users).map(user => user.name));

    useEffect(() => {
        // Aggiorna lo stato locale quando il valore di users in mediator cambia
        const updateHandler = () => {
            setUsers(Object.values(mediator.game.users).map(user => user.name));
            console.log(Object.values(mediator.game.users).map(user => user.name));
        };

        // Aggiungi il componente come osservatore di Foo
        mediator.game.addObserver({ update: updateHandler });

        return () => {
            // Rimuovi il componente come osservatore quando il componente viene smontato
            mediator.game.removeObserver({ update: updateHandler });
        };
    }, [mediator.game]);

    // Ottieni il parametro token dall'URL
    const [location, navigate] = useLocation();

    const token = location.split('/game/')[1];

    const initConnection = async (token) => {
        try {
            // Chiamata asincrona per creare un nuovo gioco
            //await mediator.peer.getId();
            if(await mediator.initConnection(token))
                console.log(mediator);
            else
                return html`Error`;
        } catch (error) {
            // Gestire eventuali errori qui
            console.error("Si è verificato un errore durante la connessione:", error);
        }
    };

    useEffect(() => {
        // Se il token è vuoto, reindirizza alla homepage
        if (!token) {
            navigate('/');
        } else {
            // Altrimenti, esegui il resto del codice
            // Qui faccio la prima parte di autenticazione se non sono host
            if(!mediator.game.isHost){
                //Authentication
                //Get token info
                //Init connection
                //Init e2e
                //Then authenticate
                
                initConnection(token);
            } 
            // Simulazione del caricamento completato
            const timer = setTimeout(() => {
                setLoading(false);
            }, 2000); // Tempo di attesa, ad esempio 2 secondi

            // Pulizia dell'effetto quando il componente viene smontato
            return () => clearTimeout(timer);
        }
    }, [token, navigate]);

    useEffect(() => {
        if (!showLoginForm) {
            // Se l'utente non è autenticato, nascondi il form di login dopo un ritardo per permettere l'animazione
            const timer = setTimeout(() => {
                setAuthenticated(true);
            }, 1000); // Tempo di attesa, ad esempio 0.5 secondi
    
            return () => clearTimeout(timer);
        }
    }, [showLoginForm]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if(gameStarted){
            mediator.game.started = true;
            console.log(mediator);
        }
    }, [gameStarted]);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //Simulazione di script che controlla la password
        /* CHIAMA SCRIPT */
        if (password === 'password_corretta') {
            setShowLoginForm(false);
        } else {
            setError('Password errata! Riprova.');
            setPassword('');
        }
        //setGameStarted(true);
    };

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
            setMessages([...messages, { text: newMessage, sender: true }]);
            setNewMessage('');
        }
    };  

    const renderUserList = () => {
        return userList.map(user => (
            html`<li>${user}</li>`
        ));
    };

    if (loading) {
        console.log(mediator);
        return html`<p>Caricamento...</p>`;
    }

    if (!authenticated && !mediator.game.isHost && !gameStarted) {
        return (
            html`<div class="login-form ${!showLoginForm ? 'hide' : ''}">
                <h2>Inserisci la password:</h2>
                <form onSubmit=${handleSubmit}>
                    <input
                        type="password"
                        value=${password}
                        onChange=${handlePasswordChange}
                        required
                    />
                    <button type="submit">Invia</button>
                </form>
                ${error &&  html`<p>${error}</p>`}
            </div>`
        );
    } else {
        setAuthenticated(true);
    }

    // Se l'utente è autenticato, mostriamo la sala d'attesa
    if(authenticated && !gameStarted){
        return (
            html`
            <div>
                <h2>Utenti Collegati:</h2>
                <ul>
                    ${renderUserList()}   
                </ul>
                <p>Attendi che il game inizi...</p>
                ${mediator.game.isHost &&
                    html`<button onClick=${() => setGameStarted(true)}>Inizia Gioco</button>`
                }
                <button onClick=${() => setUsers({...userList, 'test': {'name': 'prova'}})}>adduser</button>
                <button onClick=${() => console.log(mediator)}>adduser</button>
                ${error && html`<p>${error}</p>`}
            </div>
            `
        );
    }

    // Se il game è iniziato mostriamo la chatbox
    return (html`
        <div class="chatbox-container">
        <div class="title">Parola da indovin___</div>
        <div class="messages">
            ${messages.map((message, index) => html`
                <div class="message ${message.sender ? 'sender' : ''}" key=${index}>${message.text}</div>
            `)}
            <div ref=${messagesEndRef}></div>
        </div>
        <div class="input-box">
            <form onSubmit=${handleMessageSubmit}>
                <input type="text" placeholder="Digita il tuo messaggio..." value=${newMessage} onInput=${handleMessageChange} />
                <button type="submit">Invia</button>
            </form>
        </div></div>`
    );
};

export default Game;