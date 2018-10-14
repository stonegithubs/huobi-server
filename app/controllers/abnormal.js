import moment from 'moment';

/* {
    "id":        601595424,
    "price":     10195.64,
    "time":      1494495766,
    "amount":    0.2943,
    "direction": "buy",
    "tradeId":   601595424,
    "ts":        1494495766000
} */


/**
 * 根据字符串转成毫秒
 * @param {string} timeDes
 * @return {number}
 */
const toMillisecond = function (timeDes) {
    let s = 1000 * 60;
    let temp = {
        '5min': 5 * s,
        '1min': s,
    }
    return temp[timeDes];
}


/**
 * 异常涨幅监控
 * status: 横盘 | 跌 | 涨
 * speed: number
 * 
 */

export default class AbnormalMonitoring {
    constructor({data = {}} = {}) {
        this.reset();
        this.speed(data.trade)
    }
    reset() {
        /**
         * {time: Date, status: '涨'}
         */
        this.historyStatus = [];
        this.disTime = toMillisecond('1min'); // 5min
        // 上一个
        this._preTrade = {};
    }
    /**
     * 
     * @param {Object} data 
     * @param {number} disTime 
     */
    speed(data, disTime = this.disTime) {
        if (!data) {
            console.log(data)
            return;
        }
        // 时间戳
        let ts = data.ts;
       
        // 默认状态为 横盘
        if (this.historyStatus.length === 0 && data) {
            this._preTrade = {
                price: data.price,
                ts: data.ts
            }
            this.pushSatus({
                status: '横盘',
                strength: 0,
                ts: ts,
                timeUTC: moment(ts).format("YYYY/MM/DD h:mm:ss"),
            });
             // 根据时间差算出下一个时间的节点，默认为5min后
            this.nextTime = ts + disTime;
            return;
        }
        // "price":     10195.64,
        // "time":      1494495766,
        // "amount":    0.2943,
        // "direction": "buy",
        // "tradeId":   601595424,
        // "ts":        1494495766000
        if (ts > this.nextTime) {
            const disPrice = data.price - this._preTrade.price;
            let status = disPrice > 0 ? '涨' : '跌';
            if (Math.abs(disPrice) < 0.01) {
                status = '横盘';
            }
            this.pushSatus({
                status: status,
                strength: (disPrice / this._preTrade.price).toFixed(3),
                ts: ts,
                price: data.price,
                timeUTC: moment(ts).format("YYYY/MM/DD h:mm:ss"),
            });
             // 根据时间差算出下一个时间的节点，默认为5min后
            this.nextTime = ts + disTime;
            this._preTrade = {
                price: data.price,
                ts: data.ts
            }
        }
    }
    /**
     * 
     * @param {Object} status 
     */
    pushSatus(status) {
        if (this.historyStatus.length > 6) {
            this.historyStatus.shift();
            console.log(this.historyStatus, this)
        }
        this.historyStatus.push(status);
    }
}