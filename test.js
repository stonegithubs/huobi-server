[
    [ 0.0000079011, 974.93 ],
    [ 0.0000079012, 974.93 ],
    [ 0.0000079013, 974.93 ],
    [ 0.0000079014, 974.93 ],
]


const getOrderDensity = function ({asksList, bidsList, currentPrice}) {
    const buyDepth = {};
    const sellDepth = {};
    for (let i = 0; i < 0.20; i+=0.01) {
        let buyPrice = currentPrice * (1 + i);
        let sellPrice = currentPrice * (1 - i);
        buyDepth[i] = {
            count: 0,
            price: buyPrice,
            sumPrice: 0,
        };
        sellDepth[-i] = {
            count: 0,
            price: sellPrice,
            sumPrice: 0,
        };
    }
    

}