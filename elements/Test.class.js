class MyTest {
  constructor(page, responseURL, actions) {
    this.page = page;
    this.responseURL = responseURL;
  }

  assertMetrics = async (paramsToCheck, action_id) => {
    if (this.responseURL.includes("collect?v=")) {
      // extract params from url
      console.log(this.responseURL);
      const params = await this.getParamsFromReq(
        this.responseURL,
        this.responseURL.split("?")[0]
      );
      // console.log(params);
      // check params matching with input metrics
      const temp_results = await this.checkParams(
        params,
        paramsToCheck,
        action_id
      );
      // save in temp result and then in final results to wait for other events like this or other events after user actions

      // console.log("REQ", temp_results);
      return await temp_results;
    }
  };

  // Responsible to transform a GA4 HTTP request in an object to do our tests
  getParamsFromReq = (url, urlPartToRemove, postData) => {
    url = decodeURIComponent(url);
    let params = url
      .replace(urlPartToRemove, "")
      .split("?")
      .join("")
      .split("&");
    let payload = {};
    params.forEach((param) => {
      let key = param.split("=")[0];
      let value = param.split("=")[1];
      payload[key] = value;
    });
    if (postData) {
      postData = decodeURIComponent(postData);
      let postParams = postData.split("&");
      postParams.forEach((param) => {
        let key = param.split("=")[0];
        let value = param.split("=")[1];
        payload[key] = value;
      });
    }
    return payload;
  };

  checkParams = (params, toCheck, action_id) => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const results = {
      action_id: "action" + action_id,
      request_link: this.responseURL,
      timestamp: hours + ":" + minutes + ":" + seconds,
    };

    let request_link_eventName;
    let request_link_tid;
    Object.keys(toCheck).forEach((key) => {
      if (params[key]) {
        let operator = toCheck[key][1];
        const elToCheck = toCheck[key][0];
        // START Frontend Logger info
        if (params["en"]) {
          request_link_eventName = params["en"];
        }

        if (params["tid"]) {
          request_link_tid = params["tid"];
        }
        // END Frontend Logger info
        if (this._performCheck(operator, params[key], elToCheck)) {
          results[
            key
          ] = `OK - Test Passed, Checking for ${key} ${operator} ${elToCheck} || Actual value ${params[key]}`;
        } else {
          results[
            key
          ] = `ERR - Test Failed, Checking for ${key} ${operator} ${elToCheck} || Actual value ${params[key]}`;
        }
      } else {
        results[key] = "metric not found";
      }
    });
    results["request_link_eventName"] = request_link_eventName;
    results["request_link_tid"] = request_link_tid;

    return results;
  };

  _performCheck = (operator, original, elToCheck) => {
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
}

module.exports = { MyTest };

/*
POSTMAN

 {
      "actionID": "555",
      "action": "click",
      "selector": ".single_add_to_cart_button"
    }

*/
