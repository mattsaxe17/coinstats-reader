const puppeteer = require('puppeteer');
const { supportedHeaders, hideSmallBalances, smallBalanceLimit, tickers } = require('./config');
const { cryptoSymbol } = require('crypto-symbol');
const { symbolLookup } = cryptoSymbol({});

module.exports.getPortfolio = async url => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const overview = await getOverview(page);
  const holdings = await getHoldings(page);

  await browser.close();

  return { overview, holdings };
};

function getOverview(page) {
  return new Promise(async (resolve, reject) => {
    await page.waitForSelector('span.main-price');
    const mainPriceDiv = await page.$('span.main-price');
    const mainPrice = await page.evaluate(el => el.textContent, mainPriceDiv);

    resolve({ total: mainPrice });
  });
}

function getHoldings(page) {
  return new Promise(async (resolve, reject) => {
    await page.waitForSelector('#__next > main > div.guide-body > div > div.common-table > table');
    const tableElement = await page.$('#__next > main > div.guide-body > div > div.common-table > table');

    const headers = await tableElement.$$eval('thead tr th', headers => headers.map(header => header.textContent.toLowerCase()).filter(header => !!header));
    const values = await tableElement.$$eval('tbody tr td', cols => cols.map(col => col.textContent).filter(col => col !== ''));

    const rows = values
      .reduce((acc, cur, ind) => {
        const rowNum = Math.floor(ind / headers.length);
        const colNum = ind % headers.length;
        const num = cur.match(/[\d.]+/g)?.join('');

        if (!supportedHeaders.map(header => header.toUpperCase()).includes(headers[colNum].toUpperCase())) return acc;

        if (!!num && !isNaN(parseFloat(num))) cur = parseFloat(num);

        if (acc[rowNum]) acc[rowNum][headers[colNum]] = cur;
        else
          acc[rowNum] = {
            [headers[colNum]]: cur,
          };

        return acc;
      }, [])
      .filter(row => row.total > smallBalanceLimit && !!row.name && !!row.amount)
      .map(row => {
        return { ticker: getTicker(row.name), ...row };
      });

    resolve(rows);
  });
}

function getTicker(name) {
  let ticker;

  try {
    if (tickers[name])
    ticker = tickers[name]

    if (tickers[name.split(' ')[0]])
    ticker = tickers[name.split(' ')[0]]
  }
  finally {
    return ticker || name;
  }
}
