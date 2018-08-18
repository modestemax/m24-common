const { redisKeysExists,redisGet, computeChange } = require('./utils');

const $this = module.exports = {
    timeframeDuration: (timeframe) => timeframe * 60e3,

    getNewCandleId({ timeframe }) {
        return $this.getCandleId({ timeframe })
    },
    getCandleTime({ id, timeframe }) {
        return new Date(id * $this.timeframeDuration(timeframe))
    },
    getCandleId({ time = Date.now(), timeframe }) {
        return Math.trunc(time / $this.timeframeDuration(timeframe))
    },
    getKeyById({ exchange, symbolId, timeframe, id }) {
        const date = $this.getCandleTime({ id, timeframe });
        const timeKey = `${date.getDate()}/${date.getMonth() + 1}:${date.getHours()}h${date.getMinutes()}`;
        return `${exchange}:${symbolId}:${timeKey}:m${timeframe}`;
    },

    getKeyAtTime({ exchange, symbolId, timeframe, time = Date.now() }) {
        const id = $this.getCandleId({ time, timeframe })
        return $this.getKeyById({ exchange, symbolId, timeframe, id });
    },

    getKeyAtPosition({ exchange, symbolId, timeframe, position = 0 }) {
        let nowId = $this.getNewCandleId({ timeframe });
        return $this.getKeyById({ id: nowId - position, exchange, symbolId, timeframe })
    },

    async keyExistsAtPosition({ exchange, symbolId, timeframe, position = 0 }) {
        const key = $this.getKeyAtPosition({ exchange, symbolId, timeframe, position });
        if (await redisKeysExists(key)) {
            return key
        }

    },
    async findSignal({ exchange, symbolId, timeframe, position }) {
        let key = await $this.keyExistsAtPosition({ exchange, symbolId, timeframe, position });
        if (key) {
            let signal = await redisGet(key);
            return JSON.parse(signal);
        }
    },
    async findSignal24H({ exchange, symbolId }) {
        let key = await $this.keyExistsAtPosition({ exchange, symbolId, timeframe: 240, position: 6 });
        if (key) {
            let signal = await redisGet(key);
            return JSON.parse(signal);
        }
    },
    async change24H({ exchange, symbolId }) {
        let signal = await $this.findSignal24H({ exchange, symbolId });
        if (signal) {
            return computeChange(signal.candle.open, signal.candle.close);
        }
    },
    async   getLastKey({ exchange, symbolId, timeframe, position = 0 }) {
        let key = await $this.keyExistsAtPosition.apply(null, arguments);
        if (key) {
            return key
        } else {
            return $this.getLastKey({ exchange, symbolId, timeframe, position: position + 1 })
        }
    },
}