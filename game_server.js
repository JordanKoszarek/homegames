const WebSocket = require('ws');
const Draw = require('./src/games/draw');
const LayerTest = require('./src/games/layer-test');
const MoveTest = require('./src/games/move-test');
const TextTest = require('./src/games/text-test');
const Demo = require('./src/games/demo');
const GameSession = require('./src/GameSession');
const Player = require('./src/Player');
const https = require('https');
const fs = require('fs');
const file = fs.readFileSync('/path/to/file');

const audio64 = Buffer.from(file).toString('base64');

const PORT = 7080;

const server = https.createServer({
    cert: fs.readFileSync('/path/to/cert'),
    key: fs.readFileSync('/path/to/key')
});

let toExecute;
//toExecute = new Draw();
//toExecute = new LayerTest();
//toExecute = new MoveTest();
//toExecute = new TextTest();
toExecute = new Demo();

const session = new GameSession(toExecute, {'width': 320, 'height': 180});

const wss = new WebSocket.Server({
    server
});

wss.on('connection', (ws) => {
    const player = new Player(ws);
    //session.addPlayer(player);
    player.receiveUpdate(audio64);
});

server.listen(PORT, () => {
    const ws = new WebSocket(`wss://localhost:${server.address().port}`, {
        rejectUnauthorized: false
    });
});

