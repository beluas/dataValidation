const { chromium } = require("playwright"); // Import Playwright
const express = require("express");
const { MyTest } = require("../elements/Test.class");
const {
  normalizeBody,
  debatchRequests,
  assertRequests,
  getParamsFromReq,
  assertNormalRequest,
} = require("./GATest.utils");
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("pepp");
  try {
    (async () => {
      let logger = {
        actions: [],
        requests: [],
      };

      let website = req.query.website;
      let actualURL = req.url;
      const postData = await req.body;

      const browser = await chromium.launch({ headless: false }); // Launch the browser
      const context = await browser.newContext(); // Create a new browser context
      const page = await context.newPage(); // Open a new page

      const handler = createHandler();
      await page.route(/analytics/, (route, request) => {
        console.log(request.url());
      });
      await page.route(/g\/collect?/, handler);

      await page.goto(website, { waitUntil: "domcontentloaded" }); // Navigate to your website

      await page.waitForTimeout(20000);

      function createHandler(
        action = { actionID: "pre-actions", newPage: false }
      ) {
        return async (route, request) => {
          const requestURL = await request.url();
          console.log(action.actionID, { requestURL });
          const bodyRequest = (await request.postData()) || null;

          let normalizedBody = normalizeBody(bodyRequest);
          let postRequests = [];

          // console.log({ normalizedBody });
          if (normalizedBody) {
            for (const entry of normalizedBody) {
              postRequests.push(entry);
            }
          }

          logger.requests.push({
            actionID: action.actionID,
            request_link: requestURL,
            postData: postRequests,
            timestamp: new Date().getTime(),
            newPage: action.newPage,
          });

          route.continue();
        };
      }
      await page.waitForTimeout(20000);

      await page.unroute(/g\/collect?/, handler);

      for (const action of postData.actions) {
        action["newPage"] = actualURL !== page.url();
        actualURL = page.url();
        const handler = await createHandler(action);

        await page.route(/g\/collect?/, handler);

        const timestamp = new Date().getTime();
        switch (action.action) {
          case "click":
            await page.locator(action.selector).first().waitFor();
            await page.locator(action.selector).first().click();
            await page.waitForTimeout(20000);

            logger.actions.push({
              actionID: action.actionID,
              timestamp,
              selector: action.selector,
              action: action.action,
              type: "Action",
              newPage: actualURL !== page.url() ? page.url() : false,
            });
        }

        await page.unroute(/g\/collect?/, handler);
      }

      await page.waitForTimeout(5000);

      for (const request of logger.requests) {
        let testResults = [];
        for (const assertion of postData.assertions) {
          if (request["actionID"] === assertion["actionID"]) {
            const params = getParamsFromReq(
              request.request_link /*  this SHOULD NOT BE HARDCODED*/,
              "https://region1.google-analytics.com/g/collect" /*  /g/ SHOULD NOT BE HARDCODED*/
            );
            // console.log({ request });
            // console.log("postData params", params);
            let debatchedRequests;
            if (request.postData.length > 0) {
              debatchedRequests = debatchRequests(request.postData, params);
              const resultDebatchedRequests = assertRequests(
                debatchedRequests,
                params,
                assertion.metrics,
                request["actionID"],
                assertion.assertionID
              );
              testResults.push(resultDebatchedRequests);
            } else {
              console.log("NORMAL REQUEST");
              let resultNormalRequests = assertNormalRequest(
                request.request_link,
                params,
                assertion.metrics,
                request["actionID"],
                assertion.assertionID
              );
              testResults.push(resultNormalRequests);
            }
          }
        }
        request["testResults"] = testResults;
      }

      await page.waitForTimeout(5000);
      await context.close();
      await browser.close();
      console.log("pepp");
      console.log({ logger });
      res.send(logger);
    })();
  } catch (error) {
    console.log(error);
    await context.close();
    await browser.close();
    res.send({ error });
  }
});

router.get("/", async (req, res) => {
  res.send({ title: "Pepp" });
});
module.exports = router;

//"[data-amgdprcookie-js='accept']"
