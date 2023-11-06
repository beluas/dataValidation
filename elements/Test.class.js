const { getParamsFromReq, checkParams } = require("../utils/test.utils");

class MyTest {
  constructor(page, responseURL) {
    this.page = page;
    this.responseURL = responseURL;
  }

  assertMetrics = async (paramsToCheck) => {
    if (this.responseURL.includes("collect?v=")) {
      // extract params from url
      console.log(this.responseURL);
      const params = await getParamsFromReq(
        this.responseURL,
        this.responseURL.split("?")[0]
      );
      console.log(params);
      // check params matching with input metrics
      const temp_results = await checkParams(params, paramsToCheck);
      // save in temp result and then in final results to wait for other events like this or other events after user actions

      console.log("REQ", temp_results);
      return await temp_results;
    }
  };
}

module.exports = { MyTest };
