const request = require("retry-request", {
  request: require("request")
}); // default: 3 tries

// retry request 5 times before reject (err)
const opts = {
  retries: 4
};

const util = require("util");

const saveCandidate = require("./saveCandidate");
const postCallSMS = require("./postCallSMS");
const verifyPhoneNumber = require("./verifyPhoneNumber");
const customizeSMS = require("./customizeSMS");

const send_SMS = (type, req, res) => {
  console.log(
    util.inspect(req.body, { showHidden: false, depth: null, colors: true })
  );
  // we get the candidate's email from greenhouse webhook
  const candidateEmail = req.body.email;

  // we use the email to send an http get request to recruitee to get other data
  // then we send SMS if phone number is available and correct
  if (candidateEmail) {
    request(
      {
        headers: {
          Authorization: process.env.greenhouseKeyProd
        },
        url: `https://harvest.greenhouse.io/v1/candidates?email=${candidateEmail}`,
        method: "GET",
        json: true
      },
      opts,
      async (err, resp, body) => {
        // console.log(req.body);
        if (typeof resp.body[0] !== "undefined") {
          const { id, phone_numbers, last_name, first_name } = resp.body[0];
          const name = `${first_name} ${last_name}`;

          if (typeof phone_numbers[0] !== "undefined") {
            const phoneNum = phone_numbers[0].value; // have to check if the number is valid
            if (!verifyPhoneNumber(phoneNum)) {
              saveCandidate("Wrong number", id, name, res);
            } else {
              const smsMessage = await customizeSMS(type, name);

              if (smsMessage) {
                postCallSMS(res, phoneNum, id, name, smsMessage);
              } else {
                console.log("ERROR: Type specified not found");

                res.status(400).json({
                  success: false,
                  msg: "Type specified not found"
                });
              }
            }
          } else {
            saveCandidate("no phone number", id, name, res);
          }
        } else {
          // if there's no candidate with the same email address received form greenhouse
          console.log(
            `error: candidate not found on Greenhouse (email: ${candidateEmail}) `
          );
          res.status(400).json({
            success: false,
            error: `candidate not found on Greenhouse (email: ${candidateEmail}) `
          });
        }
        if (err) {
          console.log(
            `Error in fetching candidate (email: ${candidateEmail}) data from Greenhouse`
          );
          res.status(400).json({
            success: false,
            message: `Error in fetching candidate's data (email: ${candidateEmail}) from Greenhouse`
          });
        }
      }
    );
  } else {
    // if there's no email in mixmax webhook (is that even possible?)
    console.log(`Error: couldn't find email in client request `);
    res.status(400).json({
      success: false,
      message: "couldn't find email in client request"
    });
  }
};

module.exports = send_SMS;
