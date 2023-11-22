const normalizeBody = (bodyRequest) => {
  if (!bodyRequest) {
    return;
  }

  // console.log({ bodyRequest });
  let normalizedBody = [];

  const events = bodyRequest.split("en=").filter((el) => el);
  for (const event of events) {
    const params = event.split("&");
    params[0] = `en=${params[0]}`;
    let tempResult = {};
    for (const param of params) {
      var key = param.split("=")[0];
      var value = param.split("=")[1];
      let productParams = {};

      if (key.includes("pr")) {
        let decodedStr = decodeURIComponent(value);
        // console.log("IMPORTANT", decodeURIComponent(value));
        let tempParams = decodedStr.split("~");
        // console.log({ tempParams });
        let tempCustomValue = "";
        let tempCustomKey = "";
        let tempCustomVarKeyNr = "";
        for (const tempParam of tempParams) {
          if (tempParam.startsWith("nm")) {
            productParams["item_name"] = tempParam.split("nm")[1];
          } else if (tempParam.startsWith("id")) {
            productParams["item_id"] = tempParam.split("id")[1];
          } else if (tempParam.startsWith("pr")) {
            productParams["price"] = parseFloat(tempParam.split("pr")[1]);
          } else if (tempParam.startsWith("br")) {
            productParams["item_brand"] = tempParam.split("br")[1];
          } else if (tempParam.startsWith("ca")) {
            productParams["item_category"] = tempParam.split("ca")[1];
          } else if (tempParam.startsWith("c2")) {
            productParams["item_category2"] = tempParam.split("c2")[1];
          } else if (tempParam.startsWith("c3")) {
            productParams["item_category3"] = tempParam.split("c3")[1];
          } else if (tempParam.startsWith("ln")) {
            productParams["item_list_name"] = tempParam.split("ln")[1];
          } else if (tempParam.startsWith("li")) {
            productParams["item_list_id"] = tempParam.split("li")[1];
          } else if (tempParam.startsWith("lp")) {
            productParams["index"] = tempParam.split("lp")[1];
          } else if (tempParam.startsWith("qt")) {
            parseInt((productParams["quantity"] = tempParam.split("qt")[1]));
          } else if (/^[k][0-9]/.test(tempParam)) {
            tempCustomVarKeyNr = parseInt(
              tempParam.split("k")[1].substring(0, 1)
            );
            let actualKey = tempParam.split(`k${tempCustomVarKeyNr}`)[1];

            tempCustomKey = actualKey;
          } else if (/^[v][0-9]/.test(tempParam)) {
            let actualValueVarNr = parseInt(
              tempParam.split("v")[1].substring(0, 1)
            );
            tempCustomValue = tempParam.split(`v${actualValueVarNr}`)[1];

            if (
              parseInt(tempParam.split("v")[1].substring(0, 1)) ===
              tempCustomVarKeyNr
            ) {
              productParams[tempCustomKey] = tempCustomValue;
              tempCustomKey = "";
              tempCustomValue = "";
            }
          }
        }

        // console.log({ productParams });
        tempResult[key] = productParams;
      } else {
        // console.log({ WEWEWE: key });
        tempResult[key] = value;
      }
    }
    normalizedBody.push(tempResult);
  }
  return normalizedBody;
};

const debatchRequests = (requests, params) => {
  // Array to hold the individual request objects
  const individualRequests = [];

  requests.forEach((request) => {
    // Create an object for each request
    let requestObject = {};

    // Filter out params that have the same key as in the request
    let filteredParams = { ...params };
    for (const key in request) {
      if (filteredParams.hasOwnProperty(key)) {
        delete filteredParams[key];
      }
    }

    // Spread filtered params into the request object
    requestObject = { ...filteredParams, ...requestObject };

    // Iterate over the keys in the request
    for (const key in request) {
      if (request.hasOwnProperty(key)) {
        if (key.startsWith("pr")) {
          // Initialize the products array if it doesn't exist
          if (!requestObject.products) {
            requestObject[key] = {};
          }
          // Add the product details to the products array
          requestObject[key] = request[key];
        } else {
          // Add other details to the request object
          requestObject[key] = request[key];
        }
      }
    }

    // Add the processed request object to the array
    individualRequests.push(requestObject);
  });

  return individualRequests;
};

// Example usage

const _performCheck = (original, operator, elToCheck) => {
  original = original.toString().trim();
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

const assertRequests = (
  requests,
  params,
  assertions,
  action_id,
  assertionID
) => {
  const date = new Date();
  const timestamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const testResults = [];

  requests.forEach((request) => {
    const resultForThisRequest = {
      action_id,
      request_link: params.dl, // Assuming 'dl' is the link you want to show
      timestamp: timestamp,
      assertionID,
    };

    for (const assertionKey in assertions) {
      if (assertionKey.startsWith("pr")) {
        // Process product-related assertions
        let items = assertions[assertionKey];
        let productData = request[assertionKey] || {};

        for (const itemKey in items) {
          let original = productData[itemKey] || null;
          let operator = items[itemKey][1];
          let elToCheck = items[itemKey][0];

          let resultKey = `${assertionKey}.${itemKey}`;
          resultForThisRequest[resultKey] = original
            ? _performCheck(original, operator, elToCheck)
              ? `OK - Checked if ${itemKey} ${operator} ${elToCheck} | Actual Value: ${original}`
              : `ERR - Checked if ${itemKey} ${operator} ${elToCheck} | Actual Value: ${original}`
            : "Metric not found in Request";
        }
      } else {
        // Process non-product assertions
        let original = request[assertionKey];
        let operator = assertions[assertionKey][1];
        let elToCheck = assertions[assertionKey][0];

        resultForThisRequest[assertionKey] = original
          ? _performCheck(original, operator, elToCheck)
            ? `OK - Checked if ${assertionKey} ${operator} ${elToCheck} | Actual Value: ${original}`
            : `ERR - Checked if ${assertionKey} ${operator} ${elToCheck} | Actual Value: ${original}`
          : "Metric not found in the request";
      }
    }

    testResults.push(resultForThisRequest);
  });

  return testResults;
};

const getParamsFromReq = (url, urlPartToRemove, postData) => {
  url = decodeURIComponent(url);
  let params = url.split("?")[0].join("").split("&");
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

const assertNormalRequest = (
  responseURL,
  params,
  toCheck,
  action_id,
  assertionID
) => {
  const date = new Date();
  const timestamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const results = {
    action_id: "action" + action_id,
    request_link: responseURL,
    timestamp: timestamp,
    assertionID,
  };

  let request_link_eventName;
  let request_link_tid;
  Object.keys(toCheck).forEach((key) => {
    if (key.includes("pr")) {
      console.log("I WILL BE CHECKED BY assertRequests()", key);
    } else if (params[key]) {
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
      if (_performCheck(params[key], operator, elToCheck)) {
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

module.exports = {
  normalizeBody,
  assertRequests,
  debatchRequests,
  getParamsFromReq,
  assertNormalRequest,
};
