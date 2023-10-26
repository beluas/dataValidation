const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const assert = require("node:assert");
const { chromium, devices } = require("playwright");
const { ga_check } = require("./utils.js");
const { spawnSync } = require("child_process");

app.get("/", async (req, res) => {
  res.status(200).send("Cool");
});

app.get("/runTests", async (req, res) => {
  //spawnSync("npx", ["playwright", "install", "chromium"]);

  const ga4_url = "https://region1.google-analytics.com/g/collect?";
  const page_view_test_config = {
    tid: "G-VFY3HCNZLX",
    en: "user_engagement",
  };
  try {
    (async () => {
      try {
        const browser = await chromium.launch();
        const context = await browser.newContext(devices["Desktop Chrome"]);
        const page = await context.newPage();
        // Setup
        page.on("response", async (response) => {
          if (response.url().includes(ga4_url)) {
            // remove %2F values
            let url = decodeURIComponent(response.url()).replace(ga4_url, "");

            //console.log("URL", url);
            // generate payload splitting url using & and resplitting each block with "="
            // and then push the obj in the payload array
            const query_params = url.split("&");
            const params = query_params.map((el) => el.split("="));
            const payload = [];

            params.forEach((el) => {
              let obj = {};
              let my_key = el[0];
              let value = el[1];

              obj[my_key] = value;

              payload.push(obj);
            });
            const test_result = await ga_check(
              payload,
              page_view_test_config,
              res
            );
            console.log("TEST RESULT", test_result);
            res.status(200).send(test_result);
          }
        });

        // The actual interesting bit
        //await context.route("**.jpg", (route) => route.abort());
        await page.goto("https://beluacode.com/");
        const acceptCookieBtn = page.locator(".cmplz-accept");

        await acceptCookieBtn.waitFor();

        await acceptCookieBtn.click();

        await page.waitForTimeout(3000);

        //assert((await page.title()) === "Example Domain"); // 👎 not a Web First assertion

        // Teardown
        await context.close();
        await browser.close();
      } catch (err) {
        if (err) console.log(err);
      }
    })();
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
