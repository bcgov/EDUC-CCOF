const puppeteer = require('puppeteer');
const log = require('../components/logger');

/** @typedef {import('puppeteer').Browser} Browser - The puppeteer browser instance */

/** @type {Browser|null} */
let browser = null;

/**
 * Boostrap a browser instance and return a fresh browser context.
 *
 * @returns {Promise<import('puppeteer').BrowserContext|null>} The browser instance
 */
async function getBrowserContext() {
  try {
    if (browser instanceof puppeteer.Browser && browser.process() !== null) {
      return browser;
    }
    // To debug locally add {headless: false, devtools: true} in options
    // make sure they are boolean and not string
    log.info('Puppeteer :: getBrowserContext launching new browser process');
    browser = await puppeteer.launch({
      headless: true, // setting this to 'new' will crash on openshift
      devtools: false,
      dumpio: true,
      args: [
        '--no-sandbox',
        '--disable-software-rasterizer',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
      userDataDir: process.env.CHROME_DATA_DIR,
    });

    const browserProcess = browser.process();
    browserProcess
      .on('exit', code => log.info(`Puppeteer :: browser process exited, status: ${code}`));
    browserProcess
      .on('close', code => log.info(`Puppeteer :: browser process closed, status: ${code}`));

    return browser.createBrowserContext();
  } catch (e) {
    log.error("Puppeteer :: Browser process could not be retrieved", e);
    return null;
  }
}

/**
 * Gracefully close the browser and all of its pages/contexts.
 */
async function closeBrowser() {
  if (browser.pages().length === 0) {
    await browser.close();
  } else {
    log.warn('Puppeteer :: closeBrowser was called with pages open');
  }
}

module.exports = {
  getBrowserContext,
  closeBrowser
};
