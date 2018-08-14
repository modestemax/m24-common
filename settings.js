module.exports = {
    MAX_TRADE_COUNT_PER_STRATEGY: 5,

    strategies: filterActive({
        "testEma01": {
            timeInForce: 'GTC',
            takeProfit: 1,
            stopLoss: -2,
            trailingstop: 0,
            cancelBidAfterSecond: 30,
        },
        "emaH1H4": {
            takeProfit: null,
            trailingStop: 1,
            isActive: true,
        }
    }),

    defaultStrategyOptions: {
        isActive: false,
        timeInForce: 'FOK',
        takeProfit: 1,
        stopLoss: -2,
        trailingStop: 3,
        cancelBidAfterSecond: 60 * 60//1hour
    },
    timeframesIntervals: {
        1: 60e3,
        5: 5 * 60e3,
        15: 15 * 60e3,
        60: 60 * 60e3,
        240: 240 * 60e3,
        [60 * 24]: 60 * 24 * 60e3,
    },
};

function filterActive(objects) {
    const result = {};
    for (key in objects) {
        if (objects[key].isActive) {
            result[key] = objects[key];
        }
    }
    return result;
}