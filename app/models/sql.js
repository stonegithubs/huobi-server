// 压力位
exports.HUOBI_PRESSURE_ZONE = `
    CREATE TABLE IF NOT EXISTS HUOBI_PRESSURE_ZONE(
        id INT UNSIGNED AUTO_INCREMENT,
        symbol VARCHAR(10) NOT NULL,
        bids_max_1 FLOAT(20) NOT NULL,
        bids_max_2 FLOAT(20),
        asks_max_1 FLOAT(20) NOT NULL,
        asks_max_2 FLOAT(20),

        sell_1 FLOAT(20) NOT NULL,
        sell_2 FLOAT(20) NOT NULL,
        buy_1 FLOAT(20) NOT NULL,
        buy_2 FLOAT(20) NOT NULL,
        
        bids_max_price VARCHAR(22) NOT NULL,
        asks_max_price VARCHAR(22) NOT NULL,
        price FLOAT(15),
        time DATETIME,
        exchange VARCHAR(10),
        PRIMARY KEY ( id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;
`;

// 买卖交易金额
exports.HUOBI_TRADE = `
    CREATE TABLE IF NOT EXISTS HUOBI_TRADE(
        id INT UNSIGNED AUTO_INCREMENT,
        buy FLOAT(12) NOT NULL,
        sell FLOAT(12) NOT NULL, 
        exchange VARCHAR(10),
        symbol VARCHAR(10) NOT NULL,
        time DATETIME,
        PRIMARY KEY ( id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;
`;


