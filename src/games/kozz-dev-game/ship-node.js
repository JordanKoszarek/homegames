const standardGun = 0;

class Ship {

    constructor(playerId) {
        this.playerId = playerId;

        this.position = {x: 0, y: 0};

        this.health = 100;

        this.gun = standardGun;
    }

    getShipState() {

        return {position: this.position, health: this.health, gun: this.gun};

    }

}

module.exports = Ship;
