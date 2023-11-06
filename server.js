const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { start_db } = require("./utils/db.utils.js");
const { startPage, closePage } = require("./utils/playwright.utils.js");
const { checkParams, paramsToCheck } = require("./utils/test.utils.js");
const cors = require("cors");

const db = start_db();

app.use(cors({ origin: "http://localhost:1234" }));
// app.use(express.urlencoded()); // to check
// app.use(express.json()); // to check

const gaCheckRoute = require("./routes/gaCheck.route.js");

app.use("/ga-test", gaCheckRoute);

app.get("/easy-test", async (req, res) => {
  try {
    let website = req.query.website;
    console.log(website);
    let isGAInstalled;
    let gaID = "";

    let isGTMInstalled;
    let gtmID = "";

    let isFBInstalled;
    let fbID = "";

    const { page, context, browser } = await startPage();
    let finalResults;
    (async () => {
      // page.on("response", async (response) => {
      //   const responseURL = await response.url();
      // });

      page.on("request", async (response) => {
        const responseURL = await response.url();
        if (responseURL.includes("collect?v=")) {
          const temp_results = checkParams(responseURL, paramsToCheck);
          console.log("REQ", temp_results);
          finalResults = temp_results;
        }
      });

      await page.goto(website);

      await page.waitForTimeout(10000);

      closePage(context, browser);
      res.status(200).send(finalResults);
    })();
  } catch (err) {
    console.log(err);
  }
});

// app.get("/runTests", async (req, res) => {
//   // console.log("QUERY", req.query);
//   // console.log(req.query.website);

//   let website = req.query.website;
//   const ga4_url = "analytics";
//   const page_view_event = "en=pageview";

//   const page_view_test_config = {
//     tid: "G-VFY3HCNZLX",
//     en: "wewe",
//     dl: "pepp",
//   };

//   try {
//     (async () => {
//       try {
//         const { page, context, browser } = await startPage();
//         // Setup
//         console.log("setup");

//         page.on("response", async (response) => {
//           const responseURL = await response.url();
//           // console.log(responseURL);
//           // console.log(responseURL.includes(ga4_url));
//           console.log(responseURL);

//           try {
//             // console.log("INSIDE TRY");

//             if (
//               responseURL.includes(ga4_url) &&
//               responseURL.includes(page_view_event)
//             ) {
//               console.log(responseURL);

//               // remove %2F values
//               let url = decodeURIComponent(responseURL).replace(ga4_url, "");
//               // console.log("from response");

//               // console.log("URL", url);
//               // generate payload splitting url using & and resplitting each block with "="
//               // and then push the obj in the payload array
//               const query_params = url.split("&");
//               const params = query_params.map((el) => el.split("="));
//               const payload = [];

//               params.forEach((el) => {
//                 console.log("element", el);
//                 let obj = {};
//                 let my_key = el[0];
//                 let value = el[1];
//                 // console.log("from foreach");

//                 obj[my_key] = value;

//                 payload.push(obj);
//               });
//               const test_result = await ga_check(
//                 payload,
//                 page_view_test_config,
//                 res
//               );
//               console.log("TEST RESULT", test_result);
//               res.status(200).send(test_result);
//             }
//           } catch (err) {
//             if (err) console.log(err);
//           }
//         });

//         // The actual interesting bit
//         //await context.route("**.jpg", (route) => route.abort());
//         await page.goto(website);

//         // INTRODUCE THIS CODE!@@!@!@!@!@!

//         // const acceptCookieBtn = page.locator(".cmplz-accept");

//         // await acceptCookieBtn.waitFor();

//         // await acceptCookieBtn.click();
//         // console.log("clicked");

//         await page.waitForTimeout(10000);
//         console.log("after wait");

//         // Teardown
//         await context.close();
//         await browser.close();
//         console.log("browser closed");
//       } catch (err) {
//         if (err) console.log(err);
//       }
//     })();
//   } catch (error) {
//     res.status(500).send({ status: "error", message: error.message });
//   }
// });

app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
});
