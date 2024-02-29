import { html } from 'htm/preact';
import { useLocation } from "wouter-preact";
import { useState } from 'preact/hooks';

const HomePage = ({ mediator }) => {
    const [location, navigate] = useLocation();
    const [password, setPassword] = useState('');

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // Verifica che la password sia corretta (ad esempio, controlla la lunghezza, la complessità, ecc.)
        if (password.length >= 5 && password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)) {
            //console.log(mediator);
            mediator.passed = true;
            navigate(`/game/${encodeURIComponent(password)}`);
        } else {
            alert('La password deve contenere almeno 5 caratteri, un numero e un carattere speciale!');
        }
    };

    return (html`
        <div>
            <h2>Crea una nuova partita</h2>
            <form onSubmit=${handleFormSubmit}>
                <label for="password">Inserisci una password per accedere</label>
                <input placeholder="Password" type="password" id="password" value=${password} onInput=${(e) => setPassword(e.target.value)} required />
                <button type="submit">Invia</button>
            </form>
        </div>`
    );
};

export default HomePage;