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
  // uafvl:
  //   "Chromium;118.0.5993.70|Google%20Chrome;118.0.5993.70|Not%3DA%3FBrand;99.0.0.0",
  // uamb: "0",
  // uam: "",
  // uap: "macOS",
  // uapv: "13.6.0",
  // uaw: "0",
  // _eu: "EA",
  // _s: "2",
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

module.exports = { paramsToCheck };
