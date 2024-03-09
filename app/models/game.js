import User from "./user.js";
import DataService from "../services/dataService.js";

class Game {
    constructor() {
        this.users = {};
        this.obs = [];
        this.started = false;
        this.isHost = false;
        this.message = null;
        this.curr_word = null;
        this.data = new DataService;
    }

    startGame(){
        this.started = true;
        this.notify();
    }

    createNewGame(num = 10){
        this.generateWords(num);
        console.log(this.words);
    }

    generateWords(num = 10){
        this.words = this.data.getDataSubset(num);
    }

    addHost(peer_id, username)
    {
        if(this.started)
            return false;

        this.users['host'] = new User(peer_id);

        if(!this.users['host'].setName(username))
        {
            this.deleteUser('host');
            return false;
        }

        //this.notify();
        return true;
    }

    setPubKey(key)
    {
        if(!this.users['host'])
            return false;

        this.users['host']['pkey'] = key;
        return true;
    }

    addUser(conn) {
        if(this.started && this.users.length >= 10)
            return false;
        
        this.users[conn.peer] = new User(conn);
        //this.updateStatus();
        this.notify();
        return true;
    }

    updateUsersList(data) {
        if (Object.keys(data).length > 0) {
            Object.keys(data).forEach((key) => {
                if(!this.users[key])
                    this.users[key] = new User(key);
                
                this.users[key].setName(data[key][0]);
                this.users[key].setPoints(data[key][1]);
            });

            this.notify();
        }
    }

    deleteUser(id) {
        delete this.users[id];
        this.notify();
    }

    givePoint(id){
        if(this.users[id]){
            this.users[id].givePoint();
            this.notify();
            return true;
        } 
        return false;
    }

    getUserStats(){
        let data = {};
        if (Object.keys(this.users).length > 0) {
            Object.values(this.users).forEach(user => {
                data[user.name] = user.points;
            });
        }
        return data;
    }

    getUserData(){
        let data = {};
        if (Object.keys(this.users).length > 0) {
            Object.values(this.users).forEach(user => {
                if(user.connection.peer)
                    data[user.connection.peer] = [user.name, user.points];
                else
                    data[user.connection] = [user.name, user.points];
            });
        }
        return data;
    }

    addObserver(obs) {
        this.obs.push(obs);
    }

    removeObserver(obs) {
        this.obs = this.obs.filter(obse => obse !== obs);
    }

    notify(){
        console.log(this.obs);
        console.log(this.users);
        this.obs.forEach(observer => observer.update())
    }
}

export default Game;