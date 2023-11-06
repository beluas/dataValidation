const { chromium, devices } = require("playwright");

const startPage = async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext(devices["Desktop Chrome"]);
  const page = await context.newPage();

  return { page, context, browser };
};

const closePage = async (context, browser) => {
  // Teardown
  await context.close();
  await browser.close();
  //console.log("browser closed");
};

module.exports = { startPage, closePage };
