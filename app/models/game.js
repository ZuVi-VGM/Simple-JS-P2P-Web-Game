import User from "./user.js";

class Game {
    constructor() {
        this.users = {};
        this.obs = [];
        this.started = false;
        this.isHost = false;
        this.changed = 0;
    }

    startGame(){
        this.started = true;
        this.notify();
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

        this.notify();
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

    deleteUser(id) {
        delete this.users[id];
        this.notify();
    }

    givePoint(id){
        if(this.users[id]){
            this.users[id].givePoint();
            this.notify();
        } 
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

    updateStatus(){
        this.changed = 1;
        this.notify();
    }

    addObserver(obs) {
        this.obs.push(obs);
    }

    removeObserver(obs) {
        this.obs = this.obs.filter(obse => obse !== obs);
    }

    notify(){
        console.log(this.obs);
        this.obs.forEach(observer => observer.update())
    }
}

export default Game;