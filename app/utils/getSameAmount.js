


let config = {
	quoteCurrency: 'usdt', // 交易对
	pricePrecision: 4, // 价格精度
	amountPrecision: 2, // 量 的精度
	sortBy: 'sumMoneny',
	// 有多单时， 总和超过最小价，低于则不显示
	minSumPrice: 200,
	// 1单时， 总和超过最小价，低于则不显示
	minPrice: 1000,

}
/**
 * 
 * @param {Object} newConfig 
 */
function setConfig(newConfig) {
	Object.assign(config, newConfig);
}

/**
 * 合并相同的价格统计次数并排序
 * @param {Array<Array<number>>} data
 */
const getSameAmount = function (data, {
	type = '',
	pricePrecision = config.pricePrecision,
	amountPrecision = config.amountPrecision,
	quoteCurrency = config.quoteCurrency,
} = {}) {
	// data = data.slice(0, 400)
	let countTemp = {};

	// 统计重复次数
	for (let i = 0; i < data.length; i++) {
		let count = data[i][1];

		if (countTemp[count] === undefined) {
			countTemp[count] = {};
			countTemp[count].count = 1;
			countTemp[count].prices = [data[i][0]];
			continue;
		}
		countTemp[count].count += 1;
		countTemp[count].prices.push(data[i][0]);
	}
	let arr = [];
	for (let key in countTemp) {
		let prices = countTemp[key].prices;
		let price = 0;
		// 多个重复则取个平均数
		if (prices.length === 1) {
			price = countTemp[key].prices[0];
		} else {
			price = prices.reduce((accumulator, item) => accumulator + item) / prices.length;
		}
		// 同数量出现 的次数
		let count = countTemp[key].count;
		// 总量 = 次数 * 单个挂单量
		let sum = count * key;
		// 总价
		let sumPrice = sum * price;
		let sumDollar = sumPrice;

		// 转换成美元价格
		if (quoteCurrency === 'btc') {
			sumDollar = sumPrice * window.btcPrice;
		} else if (quoteCurrency === 'eth') {
			sumDollar = sumPrice * window.ethPrice;
		}
		if ((count > 1 && sumDollar > config.minSumPrice) || (sumDollar > config.minPrice)) {
			let data = {
				'count': count,
				'amount': Number(key).toFixed(amountPrecision),
				sumCount: sum.toFixed(amountPrecision),
				sumMoneny: sumPrice.toFixed(2),
				sumDollar: sumDollar.toFixed(2),
				price: price.toFixed(pricePrecision),
				prices: countTemp[key].prices,
			}
			arr.push(data);
		}
	}
	if (type === 'asks' && config.sortBy === 'price') {
		return arr.sort(function (a, b) {
			return a[config.sortBy] - b[config.sortBy]
		});
	}
	return arr.sort(function (a, b) {
		return b[config.sortBy] - a[config.sortBy]
	});
}
getSameAmount.setConfig = setConfig;
module.exports = getSameAmount;
// export default getSameAmount;
