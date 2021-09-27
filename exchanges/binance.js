import WebSocket from 'ws';
import axios from 'axios';

import { updateOrder } from './exchange.js';

export const binanceOrder = () => {
    let pairs = {};

    axios.get('https://api.binance.com/api/v3/exchangeInfo')
        .then(response => {
            //console.log(Object.keys(response));
            for (let symbolInfo of response.data.symbols) {
                //console.log(`${symbolInfo.baseAsset}/${symbolInfo.quoteAsset}`);
                pairs[symbolInfo.symbol.toLowerCase()] = `${symbolInfo.baseAsset}/${symbolInfo.quoteAsset}`;
            }
            return (pairs);
        })
        .then(pairs => {
            let url_pairs_1 = '';
            let url_pairs_2 = '';
            let i = 0
            for (let symb in pairs) {
                i++;
                if (i < 800) {
                    url_pairs_2 += '/' + symb + '@depth';
                    continue;
                }
                url_pairs_1 += '/' + symb + '@depth';
            }

            function updateOrderbook(data) {
                let formattedAsk = [];
                let formattedBid = [];

                for (let bids of data["b"]) {
                    if (bids !== undefined) {
                        formattedBid.push([bids[0], bids[1], 'binance']);
                    };
                }
                for (let asks of data["a"]) {
                    if (asks !== undefined) {
                        formattedAsk.push([asks[0], asks[1], 'binance'])
                    };
                }

                let formattedData = { "bid": formattedBid, "ask": formattedAsk, "pair": pairs[data['s'].toLowerCase()] };
                updateOrder(formattedData);
            }

            let binance_url_2 = "wss://stream.binance.com:9443/ws" + url_pairs_2;
            const ws2 = new WebSocket(binance_url_2);

            //let fetchOrders = new Orderbook();

            ws2.on('message', (data) => {
                if (data) {
                    const trade = JSON.parse(data); // parsing single-trade record
                    updateOrderbook(trade);
                }
            });

            ws2.on('error', err => {
                console.log(err);
            })

            let binance_url_1 = "wss://stream.binance.com:9443/ws" + url_pairs_1;
            const ws1 = new WebSocket(binance_url_1);

            ws1.on('message', (data) => {
                if (data) {
                    const trade = JSON.parse(data); // parsing single-trade record
                    updateOrderbook(trade);
                }
            });

            ws1.on('error', err => {
                console.log(err);
            })
        })
        .catch(err => {
            console.log(err);
        })
}
