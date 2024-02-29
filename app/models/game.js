import User from "./user.js";

class Game {
    constructor() {
        this.users = {};
        this.started = false;
    }

    startGame(){
        this.started = true;
    }

    addUser(conn) {
        if(this.started)
            return false;
        
        this.users[conn.peer] = new User(conn);
        return true;
    }

    deleteUser(id) {
        delete this.users[id];
    }

    givePoint(id){
        if(this.users[id])
            this.users[id].givePoint();
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
}

export default Game;