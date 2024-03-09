import data from "../data/res_shuffled.js";

class DataService{
    getDataSubset(numItems) {
        // Estrai casualmente un subset di numItems elementi dal file JSON
        const subset = [];
        const dataCopy = [...data]; // Copia dell'array per evitare modifiche all'originale

        for (let i = 0; i < numItems; i++) {
            const randomIndex = Math.floor(Math.random() * dataCopy.length);
            const randomItem = dataCopy.splice(randomIndex, 1)[0];
            subset.push(randomItem);
        }

        return subset;
    }

    // TODO: Implement data recover from API
    // async getDataSubsetX(numItems) {
    //     try {
    //         // Fetch del file JSON
    //         const response = await fetch('../data/res_shuffled.json');
            
    //         if (!response.ok) {
    //             throw new Error('Errore nel caricamento del file JSON');
    //         }

    //         // Estrazione dei dati dal JSON
    //         const jsonData = await response.json();
            
    //         // Estrazione casuale di un subset di numItems elementi dal file JSON
    //         const subset = [];
    //         const dataCopy = [...jsonData]; // Copia dell'array per evitare modifiche all'originale

    //         for (let i = 0; i < numItems; i++) {
    //             const randomIndex = Math.floor(Math.random() * dataCopy.length);
    //             const randomItem = dataCopy.splice(randomIndex, 1)[0];
    //             subset.push(randomItem);
    //         }

    //         return subset;
    //     } catch (error) {
    //         console.error('Errore nel caricamento dei dati:', error);
    //         return []; // Ritorna un array vuoto in caso di errore
    //     }
    // }
}
export default DataService;