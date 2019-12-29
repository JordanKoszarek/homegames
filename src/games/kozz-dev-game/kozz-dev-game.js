const Game = require("./game");
const gameNode = require("../../common/GameNode");
const { randomColor } = require("../../common/Colors");
const Ship = require("./ship-node");
const WebSocket = require("ws");
const generateId = require("./id-generator");
//KozzDevGame works a lot differently than most Home Games.
// First we pick a host then that most handles the game state.
// We then broadcast that game state to all other clients.
// The other clients will send the server inputs which the host will handle.
class KozzDevGame extends Game {

    constructor() {
        super(gameNode('null', null, {"x": 0, "y": 0}, {"x": 100, "y": 100}));

        this.base.text = '';

        this.ships = {};

    }


    handleNewPlayer(newPlayer) {
        super.handleNewPlayer(newPlayer);

        if (!this.hostId) {
            this.hostId = newPlayer.id;
        }

        //Player input override. Kinda weird, but didnt want to change the way player worked in Josephs code.
        newPlayer.receiveUpdate = (update) => this.handlePlayerUpdate(update, newPlayer);

        this.ships[newPlayer.id] = new Ship(newPlayer.id);

        //TODO use this
        // const gameObjectId = generateId();

        const connectMessage = {
            type: "initialize",
            id: newPlayer.id,
            isHost: this.hostId === newPlayer.id,
            gameObjectId: newPlayer.id
        };

        const newPlayerMessage = JSON.stringify({
            type: "newPlayer",
            id: newPlayer.id,
            gameObjectId: newPlayer.id
        });

        Object.values(this.players).forEach((otherPlayer) => {

            if (newPlayer.id === otherPlayer.id) {
                return;
            }

            const otherPlayerMessage = JSON.stringify({
                type: "newPlayer",
                id: otherPlayer.id,
                gameObjectId: otherPlayer.id
            });

            newPlayer.ws.send(otherPlayerMessage);
            otherPlayer.ws.send(newPlayerMessage)
        });

        newPlayer.ws.send(JSON.stringify(connectMessage));
    }

    handleInput(update, player) {

        if(!update.type) {
            console.log("No type in update:" + update);
        }

        if(update.type === 'input' && this.hostId) {

            const host = this.players[this.hostId];

            host.ws.send(JSON.stringify(update));

        }

    }

    handleState(update, player) {
        if(player.id === this.hostId && update.type === 'state') {

            this.broadcast(JSON.stringify(update));

        }
    }

    broadcast(message) {
        Object.keys(this.players).forEach((keys) => {
            const player = this.players[keys];

            if (player.ws && player.ws.readyState === WebSocket.OPEN) {
                player.ws.send(message);
            }
        });
    }

    handlePlayerUpdate(update, player) {
        const parsedUpdate = JSON.parse(update);

        if(!parsedUpdate.type) {
            console.log("No type in update:" + update);
        }

        if(parsedUpdate.type === 'uinput' && this.hostId) {

            const host = this.players[this.hostId];

            console.log(update);

            host.ws.send(update);

        }

    }


    handlePlayerDisconnect(player) {
        super.handlePlayerDisconnect(player);
    }

    tick() {
        // this.sendHostsGameState();
    }

    sendHostsGameState() {

        if (!this.gameState) {
            return;
        }

        Object.keys(this.players).forEach((keys)=>{

            const player = this.players[keys];

            if (player.id !== this.hostId &&player.ws && player.ws.readyState === WebSocket.OPEN) {
                player.ws.send(this.gameState);
            }
        });

    }


    //Old code
    getShipStatesForSending() {

        const shipStateObject = {};

        Object.keys(this.ships).forEach((shipKey) => {
            shipStateObject[shipKey] = this.ships[shipKey].getShipState();
        });

        return shipStateObject;

    }

    //Old code
    sendShipData() {
        const shipStates = this.getShipStatesForSending();

        Object.keys(this.players).forEach((keys)=>{

            const player = this.players[keys];

            if (player.ws && player.ws.readyState === WebSocket.OPEN) {

                player.ws.send(JSON.stringify({shipStates}));

            }

        });


    }

}

module.exports = KozzDevGame;
