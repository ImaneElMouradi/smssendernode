const express = require("express");
const bodyParser = require("body-parser");

const fs = require("fs");
const util = require("util");

const logFile = fs.createWriteStream("log.txt", { flags: "a" });
const logStdout = process.stdout;
// overwrite console.log to save logs in log.txt and on console (default)
console.log = e => {
  logFile.write(util.format(e) + "\n");
  logStdout.write(util.format(e) + "\n");
};

// const mongoURI = require("./config/keys").mongoURI;

const mongoose = require("mongoose");
mongoose.connect(process.env.mongoURI, { useNewUrlParser: true }, err => {
  if (err) console.log(err);
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("Connection successfull to database");
});

const app = express();
app.use(bodyParser.json());

// endpoint (of the 3rd party's webhook)
const routerWebhook = require("./routes/webhook/sms");
app.use("/", routerWebhook);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
