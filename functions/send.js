const request = require("retry-request", {
  request: require("request")
}); // default: 3 tries

// retry request 5 times before reject (err)
const opts = {
  retries: 4
};

const saveCandidate = require("./saveCandidate");
const postCallSMS = require("./postCallSMS");

const send_SMS = (message, req, res) => {
  // we get the candidate's email from mixmax webhook
  const candidateEmail = req.body.to[0].email;

  // we use the email to send an http get request to recruitee to get other data
  // then we send SMS if phone number is available and correct
  if (candidateEmail) {
    request(
      {
        headers: {
          Authorization: process.env.recruiteeKeyTest
        },
        url: `https://api.recruitee.com/c/${
          process.env.companyId_test
        }/search/new/quick?query=${candidateEmail}`,
        method: "GET",
        json: true
      },
      opts,
      (err, resp, body) => {
        if (resp.body.candidates.total >= 1) {
          const { id, name, phones } = body.candidates.hits[0];
          // or just change db model to "name" and functions params
          const first_name = name.split(" ")[0];
          const last_name = name.split(" ")[1];

          if (phones[0]) {
            const phoneNum = phones[0]; // have to check if the number is valid (format like 06- etc)
            if (phoneNum.length != 10 || phoneNum[0] != "0") {
              saveCandidate("Wrong number", id, first_name, last_name, res);
            } else {
              postCallSMS(res, phoneNum, id, first_name, last_name, message);
            }
          } else {
            saveCandidate("no phone number", id, first_name, last_name, res);
          }
        }
        if (err) {
          console.log(
            `Error in fetching candidate (email: ${candidateEmail}) data from Recruitee: ${err}`
          );
          res.status(400).json({
            success: false,
            message: `couldn't fetch candidate's data (email: ${candidateEmail}) from recruitee`
          });
        }
      }
    );
  } else {
    // if there's no email in mixmax webhook (is that even possible?)
    res.status(400).json({
      success: false,
      message: "couldn't find email in client request"
    });
  }
};

module.exports = send_SMS;
