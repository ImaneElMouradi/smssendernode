const express = require("express");

const router = express.Router();

const send_SMS = require("../../functions/send");
const verifyToken = require("../../functions/verifyToken");

const Sms = require("../../models/sms.model.js");

// endpoints for mixmax webhook

router.post("/send_quiz", verifyToken, (req, res) => {
  // endpoint  for the quiz phase
  send_SMS("send-quiz", req, res);
});

router.post("/send_challenge", verifyToken, (req, res) => {
  // endpoint for the challenge phase
  send_SMS("send-challenge", req, res);
});

router.post("/send_quiz/message", verifyToken, async (req, res) => {
  // endpoint with customizable message
  if (req.body.type) {
    const type = req.body.type;

    send_SMS(type, req, res);
  } else {
    console.log("ERROR: Type is required");

    res.status(400).send({
      success: false,
      msg: "Type is required"
    });
  }
});

module.exports = router;
