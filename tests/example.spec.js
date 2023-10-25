// // @ts-check
// const { test } = require("@playwright/test");
// const { ga_check } = require("../utils.js");
// const page_view_test_config = {
//   tid: "G-VFY3HCNZLX",
//   en: "user_engagement",
// };
// // test("has title", async ({ page }) => {
// //   await page.goto("https://beluacode.com/");

// //   // Expect a title "to contain" a substring.
// // });
// const ga4_url = "https://region1.google-analytics.com/g/collect?";
// test("GA4 Pageview", async ({ page }) => {
//   //Subscribe to 'request' and 'response' events.
//   // page.on("request", (request) =>
//   //   console.log("REQ", request.method(), request.url())
//   // );
//   page.on("response", async (response) => {
//     if (response.url().includes(ga4_url)) {
//       // remove %2F values
//       let url = decodeURIComponent(response.url()).replace(ga4_url, "");

//       console.log("URL", url);
//       // generate payload splitting url using & and resplitting each block with "="
//       // and then push the obj in the payload array
//       const query_params = url.split("&");
//       const params = query_params.map((el) => el.split("="));
//       const payload = [];

//       params.forEach((el) => {
//         let obj = {};
//         let my_key = el[0];
//         let value = el[1];

//         obj[my_key] = value;

//         payload.push(obj);
//       });
//       ga_page_view(payload, page_view_test_config);

//       // console.log("Normal payload", payload);

//       //Map the parameters to be more human friendly. E.g. ul => User Language
//       /***MAPPED PAYLOAD LOGIC - NOT DELETE */
//       // const mapped_payload = [];
//       // payload.forEach((el) => {
//       //   let key = Object.keys(el)[0];
//       //   let value = Object.values(el)[0];
//       //   const mapped_obj = {};
//       //   let mapped_key = GA4_MP[key];
//       //   // if the key is missing from the mapping obj
//       //   if (!mapped_key) {
//       //     mapped_obj[key] = value;
//       //     mapped_payload.push(mapped_obj);
//       //   } else {
//       //     mapped_obj[mapped_key] = value;
//       //     mapped_payload.push(mapped_obj);
//       //   }
//       // });

//       // console.log("Mapped payload", mapped_payload);
//       /***MAPPED PAYLOAD LOGIC - NOT DELETE */
//       // console.log(payload);
//       //ga_page_view(payload);
//     }
//   });

//   await page.goto("https://beluacode.com/");

//   const acceptCookieBtn = page.locator(".cmplz-accept");

//   await acceptCookieBtn.waitFor();

//   await acceptCookieBtn.click();

//   await page.waitForTimeout(3000);

//   // Click the get started link.
//   //await page.getByRole("link", { name: "Get started" }).click();

//   // Expects page to have a heading with the name of Installation.
//   // await expect(
//   //   page.getByRole("heading", { name: "Installation" })
//   // ).toBeVisible();
// });
