const { cryptoSymbol } = require('crypto-symbol');
const { get } = cryptoSymbol({});

module.exports = {
  supportedHeaders: ['name', 'amount', 'price', 'total'],
  hideSmallBalances: true,
  smallBalanceLimit: 5,
  tickers: get().NSPair,
};
