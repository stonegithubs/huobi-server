
/**
 * 合并相同的价格统计次数并排序
 * @param {Array<Array<number>>} data 
 */
const getSameAmount = function (data) {
    data = data.slice(0, 300)
    let price = data[0][0];
    let countTemp = {};
    for (let i = 0; i < data.length; i++) {
        let count = data[i][1];
        
        if (countTemp[count] === undefined) {
            countTemp[count] = 1;
            continue;
        }
        countTemp[count] += 1;
    }
    let arr = [];
    for (let key in countTemp) {
        
        // 同数量出现 的次数
        let count = countTemp[key];
        // 总量 = 次数 * 单个挂单量
        let sum = count * key;
        // 总价
        let sumPrice = sum * price;

        if ((count > 1 && sumPrice > 1000) || (key * price > 5000)) {
            arr.push({
                'count': count,
                '量': Number(key).toFixed(3),
                s: sum.toFixed(3),
                sp: (sumPrice| 0),
            });
        }
    }
    return arr.sort(function (a, b) {
        return b.sp - a.sp
    });
}

module.exports = getSameAmount;