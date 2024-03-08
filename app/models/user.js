class User {
    constructor(connection){
        this.connection = connection;
        this.name = 'Connecting...';
        this.points = 0;
    }

    setName(name){
        if(typeof name !== 'string' || name.trim().length === 0 || !name.trim().match(/^[a-zA-Z0-9]+$/))
            return false;

        this.name = name.trim();
        return true;
    }

    givePoint() { 
        this.points += 1;
    }

    setPoints(points) {
        this.points = points;
    }
}

export default User;