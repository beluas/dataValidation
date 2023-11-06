const express = require("express");
const router = express.Router();
const { startPage, closePage } = require("../utils/playwright.utils.js");
const {
  checkParams,
  getParamsFromReq,
  paramsToCheck,
} = require("../utils/test.utils.js");
const { MyTest } = require("../elements/Test.class.js");

router.get("/", async (req, res) => {
  try {
    let website = req.query.website;
    let selectorForEvent =
      req.query.selector ||
      "article#post-6 > div > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div > p:nth-of-type(5) > strong > span > a";

    const { page, context, browser } = await startPage();
    let finalResults = [];
    (async () => {
      // page.on("response", async (response) => {
      //   const responseURL = await response.url();
      // });

      // Check for non-interaction events
      page.on("request", async (response) => {
        const responseURL = await response.url();
        // console.log(response.url());

        const test = new MyTest(page, responseURL);
        const temp_results = await test.assertMetrics(paramsToCheck);
        if (temp_results) {
          await finalResults.push(temp_results);
        }

        // if (responseURL.includes("collect?v=")) {
        //   // extract params from url
        //   const params = getParamsFromReq(responseURL);
        //   // check params matching with input metrics
        //   const temp_results = checkParams(params, paramsToCheck);
        //   // save in temp result and then in final results to wait for other events like this or other events after user actions

        //   console.log("REQ", temp_results);
        //   finalResults.push(temp_results);
        // }
      });

      await page.goto(website);

      await page.waitForTimeout(3000);

      closePage(context, browser);
      res.status(200).send(finalResults);
    })();
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
