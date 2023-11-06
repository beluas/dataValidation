// let url =
//   "https://region1.google-analytics.com/g/collect?v=2&tid=G-BFT95EK8KY&gtm=45je3ap0v886595958&_p=1712879722&gcd=11l1l1l1l1&gdid=dYmQxMT&cid=2064362903.1698784592&ul=en-gb&sr=1792x1120&ir=1&uaa=x86&uab=64&uafvl=Chromium%3B118.0.5993.70%7CGoogle%2520Chrome%3B118.0.5993.70%7CNot%253DA%253FBrand%3B99.0.0.0&uamb=0&uam=&uap=macOS&uapv=13.6.0&uaw=0&_eu=EA&_s=2&dl=https%3A%2F%2Fwww.immobilienscout24.de%2F&dt=ImmoScout24%20%E2%80%93%20Die%20Nr.%201%20f%C3%BCr%20Immobilien&sid=1698784592&sct=1&seg=1&en=page_view&_ee=1&ep.e_page_name=homepage&ep.e_module=homepage&ep.u_test_variable_others=homepage&_et=4&up.u_sso_id=a-018b8773a63e00203e9d3908f08c05075002106d00b7e";

const paramsToCheck = {
  // v: "2",
  tid: ["G-BFT95EK", "does not contain"],
  // gtm: "45je3ap0v886595958",
  // _p: "1712879722",
  // gcd: "11l1l1l1l1",
  // gdid: "dYmQxMT",
  // cid: "2064362903.1698784592",
  // ul: "en-gb", // sr: "1792x1120",
  // ir: "1",
  // uaa: "x86",
  // uab: "64",
  // uafvl: "Chromium;118.0.5993.70|Google%20Chrome;118.0.5993.70|Not%3DA%3FBrand;99.0.0.0",
  // uamb: "0",
  // uam: "",
  // uap: "macOS",
  // uapv: "13.6.0",
  // uaw: "0",
  // _eu: "EA",
  // _s: "2"
  dl: ["https://www.immobilie", "regex"],
  dt: ["ImmoScout24 – Die Nr. 1 für Immobilien", "equals"],
  // sid: "1698784592",
  // sct: "1",
  // seg: "1",
  en: ["page_v", "contains"],
  item_name: ["item", "contains"],
  // _ee: "1",
  "ep.e_page_name": ["homepage", "contains"],
  "ep.e_module": ["homepage", "contains"],
  "ep.u_test_variable_others": ["homepage", "contains"],
  // _et: "4",
  "up.u_sso_id": [
    "a-018b8773a63e00203e9d3908f08c05075002106d00b7e",
    "contains",
  ],
};

// Responsible to transform a GA4 HTTP request in an object to do our tests
const getParamsFromReq = (url, urlPartToRemove) => {
  url = decodeURIComponent(url);

  let params = url.replace(urlPartToRemove, "").split("?").join("").split("&");
  let payload = {};
  params.forEach((param) => {
    let key = param.split("=")[0];
    let value = param.split("=")[1];
    payload[key] = value;
  });
  return payload;
};

const _performCheck = (operator, original, elToCheck) => {
  original = original.trim();
  elToCheck = elToCheck.trim();
  switch (operator.toLowerCase()) {
    case "contains":
      return original.includes(elToCheck);
    case "equals":
      return original === elToCheck;
    case "does not equal":
      return original !== elToCheck;
    case "does not contain":
      return !original.includes(elToCheck);
    case "regex":
      try {
        const regex = new RegExp(elToCheck);
        return regex.test(original);
      } catch (e) {
        console.error("Invalid regex pattern:", e);
        return false;
      }
    default:
      console.error("Unknown operator:", operator);
      return false;
  }
};

// Used to check if the params to check match the url.
// #toCheck comes from FRONTEND
const checkParams = (params, toCheck) => {
  const results = {};
  // console.log(params);
  Object.keys(params).forEach((key) => {
    // console.log(toCheck);

    if (toCheck[key]) {
      let operator = toCheck[key][1];
      const elToCheck = toCheck[key][0];
      if (_performCheck(operator, params[key], elToCheck)) {
        results[
          key
        ] = `OK - Test Passed, You were checking for ${key} ${operator} ${elToCheck} and it was ${params[key]}`;
      } else {
        results[
          key
        ] = `ERR - Test Failed, You were checking for ${key} ${operator} ${elToCheck} and it was ${params[key]}`;
      }
    }
  });

  return results;
};

module.exports = { checkParams, getParamsFromReq, paramsToCheck };
