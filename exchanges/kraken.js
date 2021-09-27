import WebSocket from 'ws';
import http from 'http';
import axios from 'axios';

import { deleteOrder, updateOrder } from './exchange.js';

const kraken_url = "wss://ws.kraken.com";
const ws = new WebSocket(kraken_url);

let deleted_pairs = [];

export const krakenOrder = async () => {
    axios.get('https://api.kraken.com/0/public/AssetPairs')
        .then(response => {
            let pairs = []
            const symb = Object.keys(response.data.result)
            for (const symbol of symb) {
                if (symbol && response.data.result[symbol].wsname) pairs.push(response.data.result[symbol].wsname);
            }
            return pairs;
            //console.log(response.data.result);
        })
        .then((pairs) => {

            let pair = pairs.slice(0, -1);
            const sub = {
                "event": "subscribe",
                "pair": pair,
                "subscription": {
                    "name": "book"
                }
            };

            //let fetchOrders = new Orderbook();

            ws.on('open', () => {
                ws.send(JSON.stringify(sub));
            })

            ws.on('message', async (data) => {
                data = JSON.parse(data.toString('utf8'));

                if (data[0] !== undefined && data.channelID === undefined) {
                    let bid, ask;
                    try {
                        // FIRST SNAPSHOT
                        if (data[1]['bs']) {
                            let formattedAsk = [];
                            let formattedBid = [];
                            for (let bids of data[1]["bs"]) {
                                if (bids !== undefined) {
                                    formattedBid.push([bids[0], bids[1], 'kraken']);
                                };
                            }
                            for (let asks of data[1]["as"]) {
                                if (asks !== undefined) {
                                    formattedAsk.push([asks[0], asks[1], 'kraken'])
                                };
                            }

                            let formattedData = { "bid": formattedBid, "ask": formattedAsk, "pair": data[3] };
                            await updateOrder(formattedData);
                        }
                        // Updates from websocket
                        else {
                            if (data[1]['a']) {
                                let formattedAsk = [];
                                for (let asks of data[1]['a']) {
                                    if (parseFloat(asks[1]) !== 0) {
                                        formattedAsk.push([asks[0], asks[1], 'kraken']);
                                        let formattedData = { "bid": [], "ask": formattedAsk, "pair": data[3] };
                                        //console.log("UPDATING - A");
                                        await updateOrder(formattedData);
                                    }
                                    else await deleteOrder([asks[0], asks[1], 'kraken'], data[3], 'ask');
                                }
                            }
                            if (data[1]['b']) {
                                let formattedBid = [];
                                for (let bids of data[1]['b']) {
                                    if (parseFloat(bids[1]) !== 0) {
                                        formattedBid.push([bids[0], bids[1], 'kraken']);
                                        let formattedData = { "bid": formattedBid, "ask": [], "pair": data[3] };
                                        //console.log("UPDATING - B");
                                        await updateOrder(formattedData);
                                    }
                                    else {
                                        if (data[3] == 'ETH/EUR') {
                                            deleted_pairs.push(bids[0]);
                                        }
                                        await deleteOrder([bids[0], bids[1], 'kraken'], data[3], 'bid');
                                    } 
                                }
                            }
                        }
                    }
                    catch (err) {
                        //console.log(`Error => ${err}  ===> kraken.js`);
                    }
                }
                else if (data.channelID === undefined && data.event !== 'systemStatus') {
                    //console.log(data);
                }
            })
        })
        .catch(err => {
            console.log(err);
        })

}
