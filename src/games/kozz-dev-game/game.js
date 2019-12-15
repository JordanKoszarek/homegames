
//Game base class
class Game {
    constructor(base) {

        this.base = base;

        this.players = {};

        this.playerCount = 0;

    }

    handleNewPlayer(player) {

        this.players[player.id] = player;


        this.updatePlayerCount(this.playerCount + 1);

    }

    updatePlayerCount(count) {

        this.playerCount = count;

    }

    handlePlayerDisconnect(player) {

        delete this.players[player.id];

        this.updatePlayerCount(this.playerCount - 1);

    }

    getRoot() {

        return this.base;

    }

    tick() {

    }
}

module.exports = Game;