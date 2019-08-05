const express = require("express");

const router = express.Router();

const send_SMS = require("../../functions/send");
const verifyToken = require("../../functions/verifyToken");

// endpoints for mixmax webhook

router.post("/send_quiz", verifyToken, (req, res) => {
  // endpoint  for the quiz phase
  send_SMS("send-quiz", req, res);
});

router.post("/send_challenge", verifyToken, (req, res) => {
  // endpoint for the challenge phase
  send_SMS("send-challenge", req, res);
});

module.exports = router;
