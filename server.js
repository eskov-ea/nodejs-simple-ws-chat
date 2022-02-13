const {WebSocketServer} = require('ws');
const { v4: uuidv4 }  = require('uuid');
const {writeFile, readFileSync, existsSync} = require('fs')

const log = existsSync('log') && readFileSync('log', 'utf-8');

const clients = {};
const messages = log ? JSON.parse(log) : [];

const wss = new WebSocketServer({port: 8000});

wss.on('connection', (ws) => {
    const id = uuidv4();
    clients[id] = ws;

    console.log(`New client ${id}`);

    ws.send(JSON.stringify(messages));

    ws.on('message', (rawMessage) => {
        const {name, message} = JSON.parse(rawMessage);
        messages.push({name, message});

        for (let id in clients) {
            clients[id].send(JSON.stringify([{name, message}]))
        }
    })

    ws.on('close', () => {
        console.log(`Client ${id} closed connection`)
    })
})

process.on('SIGINT', () => {
    wss.close();
    writeFile('log', JSON.stringify(messages), err => {
        if (err) {
            console.log(err);
        }
        process.exit();
    })
})