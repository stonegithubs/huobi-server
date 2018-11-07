
// msg = {
//     from: ,
//     type: 'sub'.
//     value:'market.${symbol}.depth.step0'
// }
class Subscribe {
    /**
     * @param {Object} send: Function
     */
    constructor({send}) {
        this.subData= {};
        this.send = send;
    }
    /**
     * @param {WebSocket} ws 
     * @param {Object} msg 
     */
    sub(ws, msg) {
        let key = msg.value;
        if (this.subData[key] === undefined) {
            this.subData[key] = {
                subscribers: [],
                id: Date.now() + key,
            };
            this.send({
                [msg.type]: msg.value,
                id: this.subData[key].id,
            });
        }
        // 只能订阅一次
        let index = this.subData[key].subscribers.includes(ws);
        if (index === -1) {
            this.subData[key].subscribers.push(ws);
        } 
    }
    /**
     * @param {WebSocket} ws 
     * @param {Object} msg 
     */
    unsub(ws, msg) {
        let key =  msg.value;

        if (!Array.isArray(this.subData[key].subscribers)) {
            return;
        }
        let wsList = this.subData[key].subscribers;
        for (let i = 0; i < wsList.length; i++) {
            let _ws = wsList[i];
            if (_ws === ws) {
                wsList.splice(i, 1);
                break;
            }
        }
        // clinet 为0时，取消订阅
        if (wsList.length === 0) {
            this.send({
                op: 'unsub',
                topic: msg.value,
                cid: this.subData[key].id,
            });
            delete  this.subData[key];
        }
    }
    forEach(callback) {
        for (let key in this.subData) {
            let item = this.subData[key];
            console.log(item);
            if (item.subscribers.length > 0) {
                callback(item);
            }
        }
    }
}
module.exports = Subscribe;