module.exports = Object.assign(require('./lib/utils'), {
    auth: require(process.env.HOME + '/.api.json').KEYS
});