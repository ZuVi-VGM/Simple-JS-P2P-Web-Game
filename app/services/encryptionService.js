class EncryptionService{

    constructor(algorithm){
        if (typeof algorithm !== 'string')
        {
            console.warn("Invalid or null value passed in Encryption Service Constructor, please, use init method to initialize the encryption service.");
            return;
        }
        
        algorithm = algorithm.toLowerCase();
        this.init(algorithm);
    }

    async init(algorithm){
        if (typeof algorithm !== 'string')
        {
            console.error("Invalid type passed during Encryption Service initialization. Must be string.");
            return;
        }

        algorithm = algorithm.toLowerCase();

        if (algorithm == 'rsa')
            await this.#generateRSAKeyPair();
        else if (algorithm == 'aes')
            await this.#generateAESKey();
        else
            console.error("Invalid value passed during Encryption Service initialization.")
    }

    async #generateRSAKeyPair() {
        try {
            const keyPair = await window.crypto.subtle.generateKey(
                {
                    name: "RSA-OAEP",
                    modulusLength: 2048, // modulus bit length
                    publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // public exponent (65537)
                    hash: "SHA-256", // hash algorithm
                },
                true, // exportable
                ["encrypt", "decrypt"] // key usability
            );
            
            this.keyPair = keyPair;
            console.log("RSA key pair successfully generated!");
        } catch (error) {
            console.error("Error generating RSA key pair:", error);
            throw error;
        }
    }

    async #generateAESKey() {
        try {
            const aesKey = await window.crypto.subtle.generateKey(
                {
                    name: "AES-GCM",
                    length: 256, // key bit length
                },
                true, // exportable
                ["encrypt", "decrypt"] // key usability
            );

            this.aesKey = aesKey;
            console.log("AES key successfully generated!");
        } catch (error) {
            console.error("Error generating AES key:", error);
            throw error;
        }
    }

    async rsaEncrypt(data){
        try{
            const encodedData = new TextEncoder().encode(data);
            const encryptedData = await window.crypto.subtle.encrypt(
                {
                    name: "RSA-OAEP"
                },
                this.keyPair.publicKey,
                encodedData
            );
            return encryptedData;
        } catch(error) {
            console.error("Error encrypting RSA data:", error);
            throw error;
        }
    }

    async rsaDecrypt(encryptedData) {
        try {
            const decryptedData = await window.crypto.subtle.decrypt(
                {
                    name: "RSA-OAEP"
                },
                this.keyPair.privateKey,
                encryptedData
            );
            const decodedData = new TextDecoder().decode(decryptedData);
            return decodedData;
        } catch (error) {
            console.error("Error decrypting RSA data:", error);
            throw error;
        }
    }

    async aesEncrypt(data) {
        try {
            const encodedData = new TextEncoder().encode(data);
            const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Genera un vettore di inizializzazione
            const encryptedData = await window.crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: iv,
                },
                this.aesKey,
                encodedData
            );
            return { encryptedData, iv };
        } catch (error) {
            console.error("Error encrypting with AES:", error);
            throw error;
        }
    }

    async aesDecrypt(encryptedData, iv) {
        try {
            const decryptedData = await window.crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: iv,
                },
                this.aesKey,
                encryptedData
            );
            const decodedData = new TextDecoder().decode(decryptedData);
            return decodedData;
        } catch (error) {
            console.error("Error decrypting with AES:", error);
            throw error;
        }
    }

    #isValidAESKey(key) {
        if (!(key instanceof CryptoKey))
            return false; // Not a CryptoKey Object
        if (key.algorithm.name !== 'AES-GCM')
            return false; // Not an AES-GCM algorithm
        if (key.type !== 'secret')
            return false; // Not a secret key
        if (key.usages.indexOf('encrypt') === -1 || key.usages.indexOf('decrypt') === -1)
            return false; // Not usable for encryption and decryption
        if (key.extractable !== true)
            return false; // Not extractable
        if (key.algorithm.length !== 256)
            return false; // Not a 256 bit key

        return true; // Valid key
    }

    /***************************************************************************
     * TODO: thinking about how to store aes key for multiple peer connections.
     * Maybe store it inside the peer queue and set it before sending data.
     ***************************************************************************/
    setAESKey(key){
        if(this.#isValidAESKey(key)){
            this.aesKey = key;
            console.log("AES key accepted.");
            return;
        }

        console.error("Invalid AES key.");
    }
}

export default EncryptionService;