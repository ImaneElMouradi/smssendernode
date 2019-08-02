const express = require("express");
const bodyParser = require("body-parser");

// for process.env variables
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
mongoose
  .connect(process.env.mongoURI, { useNewUrlParser: true })
  .catch(err => console.log(err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("Connection successfull to database");
});

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// endpoint (of the 3rd party's webhook)
const routerWebhook = require("./routes/webhook/sms");
app.use("/sms", routerWebhook);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
