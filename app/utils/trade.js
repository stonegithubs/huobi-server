// import getPriceIndex from './getPriceIndex';
const getPriceIndex = require('./getPriceIndex');
let data = [
    {
      "id":        601595424,
      "price":     10195.64,
      "time":      1494495766,
      "amount":    0.2943,
      "direction": "buy",
      "tradeId":   601595424,
      "ts":        1494495766000
    },
    {
      "id":        601595423,
      "price":     10195.64,
      "time":      1494495711,
      "amount":    0.2430,
      "direction": "buy",
      "tradeId":   601595423,
      "ts":        1494495711000
    },
    {
        "id":        601595423,
        "price":     10195.64,
        "time":      1494495712,
        "amount":    0.2430,
        "direction": "buy",
        "tradeId":   601595423,
        "ts":        1494495711300
      },
      {
        "id":        601595423,
        "price":     10195.64,
        "time":      1494495712,
        "amount":    0.2430,
        "direction": "sell",
        "tradeId":   601595423,
        "ts":        1494495711200
      },
    // more Trade Detail data here
  ];
// 153201823 0000

const tradeAnalysis = function ({data, symbol}) {
    let buyList = [];
    let sellList = [];
    let hashMap = {};
    let _price = getPriceIndex(symbol);
    data.forEach(function (item) {
        let time = item.time.toString().substring(0, 9);
        item.$ = item.price * item.amount * _price;
        if (hashMap[time] === undefined) {
            hashMap[time] = {};
        }
        if (hashMap[time][item.direction] === undefined) {
            hashMap[time][item.direction] = item;
        } else {
            hashMap[time][item.direction].$ += item.$;
        }
    });
    console.log(hashMap);
}
module.exports = tradeAnalysis;
// export default tradeAnalysis;
