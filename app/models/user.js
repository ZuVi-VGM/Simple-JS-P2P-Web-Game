class User {
    constructor(connection){
        this.connection = connection;
        this.name = '';
        this.points = 0;
    }

    setName(name){
        if(typeof name !== 'string' || name.trim().length === 0)
            return false;

        this.name = name.trim();
        return true;
    }

    givePoint() { 
        this.points += 1;
    }
}

export default User;