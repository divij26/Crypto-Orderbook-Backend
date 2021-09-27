// import { getOrders, getSymbols } from './exchanges/binance.js';
import { krakenOrder } from './exchanges/kraken.js';
import { orderDataAsk, orderDataBid } from './exchanges/exchange.js';

import express from 'express';
import { Server } from 'socket.io';
import * as http from 'http'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { binanceOrder } from './exchanges/binance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const server = http.createServer(app)

export const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
})

app.get('/ETHUSD', (req, res) => {
    res.sendFile(__dirname + '/views/ethusd.html');
})

app.get('/ETHEUR', (req, res) => {
    res.sendFile(__dirname + '/views/etheur.html');
})

app.get('/BTCUSD', (req, res) => {
    res.sendFile(__dirname + '/views/btcusd.html');
})

//binanceOrder();

krakenOrder();


io.on('connection', (socket) => {
    console.log("CONNECTED");
});

setInterval(() => {
    //console.log(`Bid:  `);
    //console.log(Object.keys(orderDataBid));
    let dataBid = {};
    let dataAsk = {};
    let i=0;
    for (let key in orderDataBid) {
        dataBid[key] = orderDataBid[key].get_inorder_array();
        i ++;

        //console.log(data[key]);
    }
    //console.log(Object.keys(orderDataAsk));
    //console.log('1');
    for (let key in orderDataAsk) {
        dataAsk[key] = orderDataAsk[key].get_inorder_array();
        i++;

        //console.log(data[key]);
    }
    //console.log(i);
    try {
        io.emit('updateBid', JSON.stringify(dataBid));
        io.emit('updateAsk', JSON.stringify(dataAsk));
    }
    catch (e) {
        console.log("ERROR");
        console.log(e);
    }

}, 100);

// setInterval(() => {
//     //console.log(orderDataBid);
//     // for (let key in orderDataBid){
//     //     console.log("KEY");
//     //     console.log(key);
//     //     //console.log(orderDataBid[key].inorder());
//     //     console.log(orderDataBid[key].get_inorder_array());
//     // }
//     if (orderDataBid['ETH/USD']) console.log(orderDataBid['ETH/USD'].get_inorder_array());
// }, 1000);

server.listen(3000, () => {
    console.log("Server running on PORT 3000! ");
})