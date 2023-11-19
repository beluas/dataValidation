const { chromium, devices } = require("playwright");

const startPage = async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    ...devices["Desktop Chrome"],
    viewport: { width: 1280, height: 1024 },
  });

  const page = await context.newPage();
  // await page.route(/google/, (route, request) => {
  //   console.log(`URL: ${request.url()}, Method: ${request.method()}`);
  //   console.log(`POSTDATA: ${request.postData()}, Method: ${request.method()}`);

  //   route.continue(); // Continue the network request without modifications
  // });
  return { page, context, browser };
};

const closePage = async (context, browser) => {
  // Teardown
  // const context = await browser.newContext({
  //   userAgent:
  //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  // });
  await context.close();
  await browser.close();
  //console.log("browser closed");
};

module.exports = { startPage, closePage };
