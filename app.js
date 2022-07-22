const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://coinstats.app/p/LJtpVI');
  
  await page.waitForSelector('span.main-price');
  let mainPriceDiv = await page.$('span.main-price')
  let mainPrice = await page.evaluate(el => el.textContent, mainPriceDiv)

  console.log(mainPrice);

  await page.waitForSelector('#__next > main > div.guide-body > div > div.common-table > table');
  let tableElement = await page.$('#__next > main > div.guide-body > div > div.common-table > table')
  let value = await tableElement.$$eval('tbody tr', nodes => nodes.map(n => n.textContent))

  console.log(value);

  await browser.close();
})();