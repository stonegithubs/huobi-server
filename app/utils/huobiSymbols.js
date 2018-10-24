const hbsdk = require('../../lib/sdk/hbsdk');

// 缓存结果
let _symbols = [];

exports._symbols = _symbols;

const getSymbols = async function() {
    if (_symbols.length > 0) {
        return _symbols;
    }
    _symbols = await hbsdk.getSymbols();
    return _symbols;
}
exports.getSymbols = getSymbols;

/**
 * 获取价格 小数位
 * @param {string}
 * @param {Object} symbol 
 */
const getSymbolInfo = function (symbol) {
    if(!symbol) {
        throw Error(`param error`);
    }
    let info = {
        'price-precision': 4,
        'amount-precision': 4,
    };
    _symbols.some((item) => {
        // base-currency:"yee"
        // price-precision:8
        // quote-currency:"eth"
        if (
            symbol.startsWith(item['base-currency']) 
            && symbol.endsWith(item['quote-currency'])
        ) {
            info['price-precision'] = item['price-precision'];
            info['amount-precision'] = item['amount-precision'];
            info['base-currency'] = item['base-currency'];
            info['quote-currency'] = item['quote-currency'];
            return true;
        }
        return false;
    });
    return info;
}


exports.getSymbolInfo = getSymbolInfo;