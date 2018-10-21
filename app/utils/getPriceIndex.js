

/**
 * 
 * @param {string} symbol
 * @return {number}
 */
const getPriceIndex = function (symbol) {
    // btc eth交易对转美元
    let _temp = {
        usdt: 1,
        btc: global.btcPrice,
        eth: global.ethPrice,
    }
    let _price;
    for (let key in _temp) {
        if (symbol.endsWith(key)) {
            _price = _temp[key];
            break;
        }
    }
    return _price;
}
module.exports = getPriceIndex;
// export default getPriceIndex;