import { html } from 'htm/preact';
import { useEffect, useState, useRef } from 'preact/hooks';
import { useLocation } from 'wouter-preact';

const Game = ({ mediator }) => {
    const [loading, setLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [messages, setMessages] = useState([
        { text: 'Messaggio Ricevuto' },
        { text: 'Messaggio Inviato', sender: true }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Ottieni il parametro token dall'URL
    const [location, navigate] = useLocation();

    const token = location.split('/game/')[1];


    useEffect(() => {
        // Se il token è vuoto, reindirizza alla homepage
        if (!token) {
            navigate('/');
        } else {
            // Altrimenti, esegui il resto del codice
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

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulazione di script che controlla la password
        /* CHIAMA SCRIPT */
        if (password === 'password_corretta') {
            setShowLoginForm(false);
        } else {
            setError('Password errata! Riprova.');
            setPassword('');
        }
    };

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
            setMessages([...messages, { text: newMessage, sender: true }]);
            setNewMessage('');
        }
    };

    if (loading) {
        console.log(mediator);
        return html`<p>Caricamento...</p>`;
    }

    if (!authenticated) {
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
    }

    // Se l'utente è autenticato, mostriamo la chatbox
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