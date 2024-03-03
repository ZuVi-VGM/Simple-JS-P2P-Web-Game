import { html } from 'htm/preact';
import { useLocation } from "wouter-preact";
import { useState } from 'preact/hooks';

const HomePage = ({ mediator }) => {
    const [location, navigate] = useLocation();
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const createGameAndNavigate = async (username, password) => {
        try {
            // Chiamata asincrona per creare un nuovo gioco
            const token = await mediator.createNewGame(username, password);
            if(token)
                navigate(`/game/${encodeURIComponent(token)}`);
            else
                alert('Error initializing game!');
        } catch (error) {
            // Gestire eventuali errori qui
            console.error("Si è verificato un errore durante la creazione del gioco:", error);
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // Verifica che la password sia corretta (ad esempio, controlla la lunghezza, la complessità, ecc.)
        if (username.trim().match(/^[a-zA-Z0-9]+$/) && password.length >= 5 && password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)) {
            //FUNZIONE ASINCRONA CHE DEVE RESTITUIRE TRUE PRIMA DEL NAVIGATE
            createGameAndNavigate(username, password);
        } else {
            alert('L\' username deve contenere solo lettere e/o numeri.\r\nLa password deve contenere almeno 5 caratteri, un numero e un carattere speciale!');
        }
    };

    return (html`
        <div>
            <h2>Crea una nuova partita</h2>
            <form onSubmit=${handleFormSubmit}>
                <label for="username">Inserisci un username</label>
                <input placeholder="Username" type="text" id="username" value=${username} onInput=${(e) => setUsername(e.target.value)} required />
                <label for="password">Inserisci una password per accedere</label>
                <input placeholder="Password" type="password" id="password" value=${password} onInput=${(e) => setPassword(e.target.value)} required />
                <button type="submit">Invia</button>
            </form>
        </div>`
    );
};

export default HomePage;