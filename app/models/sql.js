// 压力位
exports.HUOBI_PRESSURE_ZONE = `
    CREATE TABLE IF NOT EXISTS HUOBI_PRESSURE_ZONE(
        id INT UNSIGNED AUTO_INCREMENT,
        symbol VARCHAR(10) NOT NULL,
        price FLOAT(15),
        time DATETIME,
        exchange VARCHAR(10),

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
        
        PRIMARY KEY ( id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;
`;
// 特征
exports.HUOBI_CHARACTERISTIC = `
    CREATE TABLE IF NOT EXISTS HUOBI_CHARACTERISTIC(
        id INT UNSIGNED AUTO_INCREMENT,
        symbol VARCHAR(10) NOT NULL,
        price FLOAT(15),
        time DATETIME,
        exchange VARCHAR(10),

        bids_max_1 FLOAT(20) NOT NULL,
        bids_max_2 FLOAT(20),
        asks_max_1 FLOAT(20) NOT NULL,
        asks_max_2 FLOAT(20),

        sell_1 FLOAT(20) NOT NULL,
        sell_2 FLOAT(20) NOT NULL,
        buy_1 FLOAT(20) NOT NULL,
        buy_2 FLOAT(20) NOT NULL,
        
        originBidsLen int(6),
        originAsksLen int(6),
        bidsLen int(5),
        asksLen int(5),
        bidsRobotMaxCount int(3),
        asksRobotMaxCount int(3),
        
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

// 买卖交易金额
exports.WATCH_SYMBOLS = `
    CREATE TABLE IF NOT EXISTS WATCH_SYMBOLS(
        id INT UNSIGNED AUTO_INCREMENT,
        symbol VARCHAR(10),
        PRIMARY KEY ( id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;
`;

