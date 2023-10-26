const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const assert = require("node:assert");
const { chromium, devices } = require("playwright");
const { ga_check } = require("./utils.js");
const { spawnSync } = require("child_process");

app.get("/1", async (req, res) => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    devices: ["Desktop Chrome"],
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 1024 },
  });
  const page = await context.newPage();
  await page.goto("https://beluacode.com/");
  page.on("response", async (response) => {
    console.log("RES", response.url());
  });
  page.on("request", async (response) => {
    console.log("REQ", response.url());
  });

  page.on("console", async (msg) => {
    console.log(`Browser Console [${msg.type()}]: ${msg.text()}`);
  });
  //await page.waitForSelector(".cmplz-accept");

  await page.waitForTimeout(10000);
  // Teardown
  await context.close();
  await browser.close();
  await page.screenshot();
  res.status(200).send("went to page");
});

app.get("/runTests", async (req, res) => {
  console.log("started");

  const ga4_url = "collect?";
  const page_view_test_config = {
    tid: "G-VFY3HCNZLX",
    en: "user_engagement",
  };
  try {
    (async () => {
      try {
        const browser = await chromium.launch({ headless: false });
        const context = await browser.newContext(devices["Desktop Chrome"]);
        const page = await context.newPage();
        // Setup
        console.log("setup");

        page.on("response", async (response) => {
          const responseURL = await response.url();
          console.log(responseURL);
          console.log(responseURL.includes(ga4_url));

          try {
            console.log("INSIDE TRY");
            if (
              responseURL.includes(ga4_url) ||
              responseURL.includes(ga4_url)
            ) {
              // remove %2F values
              let url = decodeURIComponent(responseURL).replace(ga4_url, "");
              console.log("from response");

              // console.log("URL", url);
              // generate payload splitting url using & and resplitting each block with "="
              // and then push the obj in the payload array
              const query_params = url.split("&");
              const params = query_params.map((el) => el.split("="));
              const payload = [];

              params.forEach((el) => {
                let obj = {};
                let my_key = el[0];
                let value = el[1];
                console.log("from foreach");

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
          } catch (err) {
            if (err) console.log(err);
          }
        });

        // The actual interesting bit
        //await context.route("**.jpg", (route) => route.abort());
        await page.goto("https://beluacode.com/");

        // INTRODUCE THIS CODE!@@!@!@!@!@!

        // const acceptCookieBtn = page.locator(".cmplz-accept");

        // await acceptCookieBtn.waitFor();

        // await acceptCookieBtn.click();
        // console.log("clicked");

        await page.waitForTimeout(10000);
        console.log("after wait");

        //assert((await page.title()) === "Example Domain"); // 👎 not a Web First assertion

        // Teardown
        await context.close();
        await browser.close();
        console.log("browser closed");
      } catch (err) {
        if (err) console.log(err);
      }
    })();
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
});
