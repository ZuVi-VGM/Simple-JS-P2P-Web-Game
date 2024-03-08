import data from "../data/saltinmente.js";

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
}
export default DataService;