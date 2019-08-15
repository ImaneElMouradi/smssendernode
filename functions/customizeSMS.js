const Sms = require("../models/sms.model");

const customizeSMS = async (type, name) => {
  const sms = await Sms.findOne({ type });
  if (sms) {
    return sms.content;
  }
  return null;
};

module.exports = customizeSMS;
