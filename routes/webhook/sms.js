const express = require("express");

const router = express.Router();

const send_SMS = require("../../functions/send");

const verifyToken = require("../../functions/verifyToken");

// endpoints for mixmax webhook

router.post("/send_quiz", verifyToken, (req, res) => {
  // endpoint  for the quiz phase
  console.log(req);
  const message =
    "Congratulations! You have been selected to move to the next step of the hiring process at United Remote. We kindly ask that you complete one of the short tech quizzes sent to you on your email address.  ";
  send_SMS(message, req, res);
});

router.post("/send_challenge", verifyToken, (req, res) => {
  // endpoint for the challenge phase
  const message =
    "Congratulations! You have been selected to move to the 2nd step in the journey to join United Remote. Please check your email address for the coding challenge";
  send_SMS(message, req, res);
});

module.exports = router;
