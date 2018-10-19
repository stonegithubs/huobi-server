// 压力位
exports.HUOBI_PRESSURE_ZONE = `
    CREATE TABLE IF NOT EXISTS HUOBI_PRESSURE_ZONE(
        id INT UNSIGNED AUTO_INCREMENT,
        amount VARCHAR(20) NOT NULL,
        exchange VARCHAR(15),
        price VARCHAR(20) NOT NULL,
        symbol VARCHAR(15) NOT NULL,
        type VARCHAR(10) NOT NULL,
        time DATETIME,
        PRIMARY KEY ( id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;
`;

// 深度
exports.HUOBO_DEPTH = `
    CREATE TABLE IF NOT EXISTS HUOBO_DEPTH(
        id INT UNSIGNED AUTO_INCREMENT,
        symbol VARCHAR(20) NOT NULL,
        time DATETIME,
        tick VARCHAR(200) NOT NULL,
        asksList VARCHAR(10000) NOT NULL,
        bidsList VARCHAR(10000) NOT NULL,
        PRIMARY KEY ( id )
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;
`;