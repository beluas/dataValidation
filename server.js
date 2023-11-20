const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { start_db } = require("./utils/db.utils.js");

const cors = require("cors");

const db = start_db();

app.use(cors({ origin: "*" }));
app.use(express.json());

const test = require("./routes/test.js");

app.use("/ga-test", test);

app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
});
