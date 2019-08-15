const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SmsSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

module.exports = Sms = mongoose.model("sms", SmsSchema);
