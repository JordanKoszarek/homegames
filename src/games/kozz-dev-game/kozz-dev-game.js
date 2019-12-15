const Game = require("./game");
const gameNode = require("../../Common/GameNode");
const { randomColor } = require("../../Common/Colors");
const Ship = require("./ship-node");
const WebSocket = require("ws");
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


    handleNewPlayer(player) {
        super.handleNewPlayer(player);

        if (!this.hostId) {
            this.hostId = player.id;
        }

        //Player input override. Kinda weird, but didnt want to change the way player worked in Josephs code.
        player.receiveUpdate = (update) => this.handlePlayerUpdate(update, player);

        this.ships[player.id] = new Ship(player.id);

        const connectMessage = {
            type: "initialize",
            id: player.id,
            isHost: this.hostId === player.id
        };

        const newPlayerMessage = JSON.stringify({
            type: "newPlayer",
            id: player.id
        });

        Object.values(this.players).forEach((otherPlayer)=>{
            otherPlayer.ws.send(newPlayerMessage)
        });

        player.ws.send(JSON.stringify(connectMessage));
    }

    handleInput(update, player) {

        console.log(update)

        if(!update.type) {
            console.log("No type in update:" + update);
        }

        if(update.type === 'input' && this.hostId) {

            const host = this.players[this.hostId];

            console.log('got input');

            console.log(update);

            host.ws.send(JSON.stringify(update));

        }

    }

    handlePlayerUpdate(update, player) {
        const parsedUpdate = JSON.parse(update);

        console.log('player update')
        console.log(update)

        if(!parsedUpdate.type) {
            console.log("No type in update:" + update);
        }

        if(parsedUpdate.type === 'uinput' && this.hostId) {

            const host = this.players[this.hostId];

            console.log('got input');

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
