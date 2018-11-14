
/**
 * 
 * @param {number} dayCount 
 * @param {*} data 
 */
function calculateMA(dayCount, data) {
    var result = [];
    for (var i = 0, len = data.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += data[i - j][1];
        }
        result.push(sum / dayCount);
    }
    return result;
}


exports.calculateMA = calculateMA;

/**
 * 与上面的功能一样，区别是此方法用于for遍历中，上面的已经把循环给做了
 */
class CalculateMA {
    constructor(dayCount) {
        this.dayCount = dayCount;
        this.result = [];
    }
    push(data, index, key = 'close') {
        if (index < this.dayCount) {
            this.result.push('-');
            return;
        }
        var sum = 0;
        for (var j = 0; j < this.dayCount; j++) {
            sum += data[index - j][key];
        }
        this.result.push(sum / this.dayCount);
    }   
    last() {
        return this.result[this.result.length - 1];
    }
}
exports.CalculateMA = CalculateMA;