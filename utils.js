// const expect = require("@playwright/test");
const assert = require("node:assert");

const GA4_MP = {
  // Request Parameters
  v: "Protocol Version",

  tid: "Tracking ID",

  gtm: "GTM Hash Info",

  _p: "Random Page Load Hash",

  sr: "Screen Resolution",

  ul: "User Language",

  dh: "Document Hostname",

  cid: "client Id",

  _s: "Hit Counter",

  richsstsse: "richsstsse",

  // Shared params

  dl: "Document Location",

  dt: "Document Title",

  dr: "Document Referrer",

  _z: "_z",

  _eu: "Event Usage",

  edid: "Event Debug ID?",

  _dbg: "is Debug",

  ir: "Ignore Referrer",

  tt: "Traffic Type",

  gcs: "Google Consent Status",

  gcu: "Google Consent Update",

  gcut: "Google Consent Update Type",

  gcd: "Google Consent Default",

  _glv: "is Google Linker Valid",

  // Event params

  en: "Event Name",

  _et: "Engagement Time",

  // ep.*: "Event Parameter (String)"
  // epn.*: "Event Parameter(Number)"

  _c: "is Conversion",

  _ee: "External Event",
};
const ga_check = async (payload, config, res) => {
  const errors = [];

  //   try {
  await payload.map(async (el) => {
    let temp_key = Object.keys(el)[0];
    if (config[temp_key]) {
      //   console.log(el[temp_key], config[temp_key]);
      try {
        await assert(el[temp_key] === config[temp_key]);
      } catch (err) {
        if (err) {
          console.log("ERROR", "Metrics don't match");
          console.log("expected:", config[temp_key], "actual:", el[temp_key]);
          const temp_obj = {};
          temp_obj[
            temp_key
          ] = `ERROR: Metrics don't match! Expected: ${config[temp_key]} got instead ${el[temp_key]}`;
          errors.push({
            temp_obj,
          });
        }
      }
    }
  });

  return errors;

  //   } catch (err) {
  //     if (err) console.log(err);
};

//   //   gaIDToCheck = gaIDToCheck.trim();
//   //   payload.map((el) => {
//   //     console.log(el);
//   //     if (Object.keys(el)[0] === "tid") {
//   //       console.log(gaIDToCheck, Object.values(el)[0]);
//   //       expect(gaIDToCheck).toBe(Object.values(el)[0]);
//   //     }
//   });
//};

module.exports = Object.freeze({
  GA4_MP,
  ga_check,
});
