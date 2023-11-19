const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { start_db } = require("./utils/db.utils.js");
const { startPage, closePage } = require("./utils/playwright.utils.js");
const { checkParams, paramsToCheck } = require("./utils/InputData.js");
const cors = require("cors");

const db = start_db();

app.use(cors({ origin: "http://localhost:1234" }));
app.use(express.json());

// const gaCheckRoute = require("./routes/gaCheck.route.js");
// const easyTest = require("./routes/easytest.route.js");
const test = require("./routes/test.js");

app.use("/ga-test", test);

// app.get("/easy-test", easyTest);

app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
});
