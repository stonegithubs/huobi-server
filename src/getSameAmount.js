
/**
 * 合并相同的价格统计次数并排序
 * @param {Array<Array<number>>} data 
 */
const getSameAmount = function (data) {
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
        if (countTemp[key] > 1) {
            let sum = countTemp[key] * key;
            if (1) {
                arr.push({
                    count: countTemp[key],
                    amount: key,
                    sum: sum
                });
            }
        }
    }
    return arr.sort(function (a, b) {
        return b.count - a.count
    });
}

module.exports = getSameAmount;