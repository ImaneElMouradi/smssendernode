const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const fs = require("fs");
const util = require("util");

const logFile = fs.createWriteStream("log.txt", { flags: "a" });
const logStdout = process.stdout;
// overwrite console.log to save logs in log.txt and on console (default)
console.log = e => {
  logFile.write(util.format(e) + "\n");
  logStdout.write(util.format(e) + "\n");
};

const mongoURI = require("./config/keys").mongoURI;

const mongoose = require("mongoose");
mongoose.connect(mongoURI, { useNewUrlParser: true }, err => {
  if (err) console.log(err);
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("Connection successfull to database");
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

// endpoint (of the 3rd party's webhook)
const routerWebhook = require("./routes/webhook/sms");
app.use("/", routerWebhook);

// api used by front-end app
const routerApi = require("./routes/api/candidates");
app.use("/", routerApi);

// serve up static assets
if (process.send.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
