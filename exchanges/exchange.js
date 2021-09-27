import { RedBlackTree } from './red-black-tree.js';
import { io } from '../app.js';

// GLOBAL ORDERBOOK DATA
export let orderDataBid = {};
export let orderDataAsk = {};


function updateOrder(data) {
    return new Promise(resolve => {
        if (!(data.pair in orderDataBid)) {
            const bids = data.bid;
            orderDataBid[data.pair] = new RedBlackTree();
            for (let b of bids) {
                orderDataBid[data.pair].insert(b);
                // console.log(b);
                // console.log(orderDataBid[data.pair]);
                // console.log(data.pair);
                try {
                    if (orderDataBid[data.pair].get_total_elements() > 10) {
                        while (orderDataBid[data.pair].get_total_elements() > 10) orderDataBid[data.pair].delete_smallest();
                    }
                }
                catch (err) {
                    console.log(orderDataBid[data.pair])
                    console.log(err);
                    debugger
                }
            }
        }
        if (!(data.pair in orderDataAsk)) {
            const asks = data.ask;
            orderDataAsk[data.pair] = new RedBlackTree();
            for (let a of asks) {
                orderDataAsk[data.pair].insert(a);
                if (orderDataAsk[data.pair].get_total_elements() > 10) {
                    while (orderDataAsk[data.pair].get_total_elements() > 10) orderDataAsk[data.pair].delete_largest();
                }
            }
        }
        else {
            const asks = data.ask;
            for (let a of asks) {
                orderDataAsk[data.pair].insert(a);
                if (orderDataAsk[data.pair].get_total_elements() > 10) {
                    //console.log(data.pair, orderDataAsk[data.pair].get_total_elements(), " abc");
                    while (orderDataAsk[data.pair].get_total_elements() > 10) orderDataAsk[data.pair].delete_largest();
                }
                
            }

            const bids = data.bid;
            for (let b of bids) {
                orderDataBid[data.pair].insert(b);
                if (data.pair === 'ETH/EUR') console.log(b);
                if (orderDataBid[data.pair].get_total_elements() > 10) {
                    while (orderDataBid[data.pair].get_total_elements() > 10) {
                        //console.log(data.pair, orderDataAsk[data.pair].get_total_elements());
                        orderDataBid[data.pair].delete_smallest();
                    }
                    //console.log(data.pair, orderDataAsk[data.pair].get_total_elements() + " a aa");
                }
            }
        }
        //if (orderDataBid['WAVES/USD']) console.log(orderDataBid['WAVES/USD'].get_inorder_array());
        resolve('Done');
    })
}

function deleteOrder (data, pair, type) {
    //delete order if present
    return new Promise(resolve => {
        if (type === 'bid') orderDataBid[pair].delete_node(data);
        if (type === 'ask') orderDataAsk[pair].delete_node(data);
        resolve("Done");
    })
}



export { updateOrder, deleteOrder };