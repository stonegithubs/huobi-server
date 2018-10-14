
/* amount:"141940.65"
count:1
price:"0.00018500"
prices:Array[1]
sumCount:"141940.65"
sumDollar:"172469.25"
sumMoneny:"26.26" */
function getTop(arr) {
    return JSON.parse(JSON.stringify(arr))
    .slice(0, 10)
    .sort(function (a, b) {
        return Number(a.price) - Number(b.price);
    });
}


/**
 * 
 * 根据买卖压力推荐价格
 */
export const getTracePrice = function ({
    bidsList,
    asksList,
    buyCount,
    sellCount,
    preSame,
}) {

    let bindsAvg = 0;
    let asksAvg = 0;

    
    // bidsList.sort(function (a, b) {
    //     return Number(a.price) - Number(b.price);
    // });
    // asksList.sort(function (a, b) {
    //     return Number(a.price) - Number(b.price);
    // });
    let newBidsList = getTop(bidsList);
    let newAsksList = getTop(asksList);
    if (newBidsList.length <= 2) {
        return;
    }

    let sum1 = 0;
    let sum2 = 0;
    // 重复则取第一个作为备用
    let bak = [];
    let len = newBidsList.length > newAsksList.length ? newAsksList.length : newBidsList.length;

    for(let i = 0; i < (len / 2); i++) {
        bak.push({
            buyPrice: newBidsList[i].price,
            sellPrice: newAsksList[len - i - 1].price
        });
    }
    newBidsList.forEach(item => {
        sum1 += Number(item.price);
    });
    newAsksList.forEach(item => {
        sum2 += Number(item.price);
    });
    bindsAvg = sum1 / newBidsList.length;
    asksAvg = sum2 / newAsksList.length;
    
    let dis = newBidsList.length > 5 ? buyCount: 1;
    let buyIndex = Math.round(newBidsList.length/2) + buyCount;
    console.log(newBidsList)
    dis = newAsksList.length > 5 ? sellCount: 1;
    let sellIndex = Math.round(newAsksList.length/2) - sellCount;
    
    console.log(newAsksList)
    return {
        buyPrice: newBidsList[buyIndex] ? newBidsList[buyIndex].price : newBidsList[0].price,
        sellPrice: newAsksList[sellIndex] ? newAsksList[sellIndex].price : newAsksList[0].price,
        asksAvg,
        bindsAvg,
        bak: bak
    };
}