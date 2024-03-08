import { html } from 'htm/preact';
import { useEffect, useState, useRef, useReducer } from 'preact/hooks';
import { useLocation } from 'wouter-preact';

const Game = ({ mediator }) => {

    const reducer = (state, action) => {
        switch (action) {
          case true: return 'host'; //isHost
          case false: return -1; //notHost
          case 'validated': return 'validated'; //token Validated
          case 'connected': return 'connected'; //game connected
          case 'started': return 'started'; //game started
          case 'loading': return 'loading'; //loading
         
          default: throw new Error('Unexpected action');
        }
    };

    const [status, dispatch] = useReducer(reducer, (mediator.game.isHost) ? 'connected' : -1);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [url] = useState(window.location.href);
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const [connData, setConnection] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currWord, setCurrWord] = useState();
    
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Ottieni il parametro token dall'URL
    const [location, navigate] = useLocation();
    const token = location.split('/game/')[1];

    const [userList, setUsers] = useState(Object.values(mediator.game.users).map(user => user.name));

    useEffect(() => {
        // Aggiorna lo stato locale quando il valore di users in mediator cambia
        const updateHandler = () => {
            setUsers(Object.values(mediator.game.users).map(user => user.name));
            if(mediator.game.started)
                dispatch('started');
            if(mediator.game.message)
                setMessages(prevMessages => [...prevMessages, mediator.game.message]);
            if(mediator.game.curr_word)
                setCurrWord(mediator.game.curr_word);

            mediator.game.message = null;
            console.warn(this.game.curr_word);
        };

        // Aggiungi il componente come osservatore di Foo
        mediator.game.addObserver({ update: updateHandler });

        return () => {
            // Rimuovi il componente come osservatore quando il componente viene smontato
            mediator.game.removeObserver({ update: updateHandler });
        };
    }, [mediator.game]);

    const validateToken = async (token) => {
        //Check for valid token else -> show error invalid game
        const tokenObj = await mediator.validateToken(token);

        if(!(tokenObj)){
            setError('Error validating Token');
        } else {
            setConnection(tokenObj);
            dispatch('validated');
        }
    }

    const initConnection = async (connData, username) => {       
        // Chiamata asincrona per creare un nuovo gioco
        //await mediator.peer.getId();
        if(await mediator.initConnection(connData, username))
            setShowLoginForm(false);
        else
            setError('Error during connection.');
    };

    const sendMessage = (message) => {
        //Handle message errors
        mediator.sendMessage(message);

    }

    useEffect(() => {
        // Se il token è vuoto, reindirizza alla homepage
        if (!token) {
            navigate('/');
        } else {
            // Qui verifico il token se non sono host
            if(!mediator.game.isHost){
                //Verifica sul token
                dispatch('loading');
                validateToken(token);
            } else {
                dispatch('connected');
            }
        }
    }, [token, navigate]);

    //Login form effect (fade out)
    useEffect(() => {
        if (!showLoginForm) {
            // Se l'utente è autenticato, nascondi il form di login dopo un ritardo per permettere l'animazione
            const timer = setTimeout(() => {
                dispatch('connected');
            }, 1000); // Tempo di attesa, ad esempio 0.5 secondi
    
            return () => clearTimeout(timer);
        }
    }, [showLoginForm]);


    /* CHAT MESSAGES */
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
            sendMessage(newMessage);
            //setMessages([...messages, { text: newMessage, sender: true }]);
            setNewMessage('');
        }
    }; 

    //Game started effect
    useEffect(() => {
        if(gameStarted){
            mediator.game.started = true;
            console.log(mediator);
        }
    }, [gameStarted]);


    /* Username authentication (TODO: Require also password) */
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //Simulazione di script che controlla la password
        /* CHIAMA SCRIPT */
        if (username.trim().match(/^[a-zA-Z0-9]+$/)) {
            //Chiamare funzione che effettua il login
            dispatch('loading');
            initConnection(connData, username);
        } else {
            alert('L\' username deve contenere solo lettere e/o numeri.');
            setUsername('');
        }
        //setGameStarted(true);
    };

    /* UserList */
    const renderUserList = () => {
        return userList.map(user => (
            html`<li>${user}</li>`
        ));
    };

    const copyUrl = () => {
        navigator.clipboard.writeText(url)
          .then(() => {
            alert('URL copiato nella clipboard');
            
          })
          .catch(err => {
            console.error('Errore durante la copia dell\'URL nella clipboard: ', err);
          });
    };

    if (error) {
        return html`${error}`;
    }
    
    // Form di autenticazione (per ora solo username)
    const showAuthentication = () => {
        return (
            html`<div class="login-form ${!showLoginForm ? 'hide' : ''}">
                <h2>Inserisci l'username:</h2>
                <form onSubmit=${handleSubmit}>
                    <input
                        type="text"
                        value=${username}
                        onChange=${handleUsernameChange}
                        required
                    />
                    <button type="submit">Invia</button>
                </form>
            </div>`
        );
    };

    //Waiting room x game non iniziato
    const showWaitingRoom = () => {
        return (
            html`
            <div>
                <h2>Utenti Collegati:</h2>
                <ul>
                    ${renderUserList()}   
                </ul>
                <p>Attendi che il game inizi...</p>
                
                <div>
                <label for="url">Premi per copiare e invitare i tuoi amici:</label>
                <input id="url" type="text" value=${url} onclick=${copyUrl} readonly />
                </div>
                ${mediator.game.isHost &&
                    html`<button onClick=${() => mediator.startGame()}>Inizia Gioco</button>`
                }

            </div>
            `
        );
    };

    // Se il game è iniziato mostriamo la chatbox
    const showGame = () => {
        return (html`
        <div class="chatbox-container">
        <div class="title">${currWord['definizione']} ${currWord['parola'][0]}</div>
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

    switch(status)
    {
        case 'loading': return html`<p>Caricamento...</p>`;
        case 'validated': return showAuthentication();
        case 'connected': return showWaitingRoom();
        case 'started': return showGame();
    }    
};

export default Game;