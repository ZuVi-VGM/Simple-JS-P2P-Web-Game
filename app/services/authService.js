class AuthenticationService {
    constructor(){
        this.api = 'http://lsysprojects.altervista.org/saltinmente/api/'
    }

    async get(url) {
        try {
            const response = await fetch(this.api + url);
            if (!response.ok) {
                throw new Error('Errore durante la richiesta GET');
            }
            return await response.json();
        } catch (error) {
            console.error('Errore:', error);
            throw error;
        }
    }

    async post(url, data) {
        try {
            const formattedData = this.formatData(data);
            const response = await fetch(this.api + url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded" 
                },
                body: formattedData 
            });
    
            if (!response.ok) {
                throw new Error('Errore durante la richiesta POST');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Errore:', error);
            throw error;
        }
    }
    
    formatData(data) {
        const params = new URLSearchParams();
        for (const key in data) {
            params.append(key, data[key]);
        }
        return params.toString();
    }
}

export default AuthenticationService;