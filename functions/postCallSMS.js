const request = require("retry-request", {
  request: require("request")
}); // default: 3 tries

const saveCandidate = require("./saveCandidate");

// retry request 5 times before reject (err)
const opts = {
  retries: 4
};

const shortcode = "United Remote"; // you can add in the API /&shortcode=${sender}/

// url used for testing purposes only, will be replaced with bulksms url
// prod: https://bulksms.ma/developer/sms/send?token=${process.env.bulksmsToken}&tel=${phoneNum}&message=${message}
const testUrl = "https://en0bf1o2s239lv.x.pipedream.net/SendSMS";

// function to send SMS - uses bulksms.ma (mock for now) - 5 tries
const postCallSMS = (res, phoneNum, id, name, message) => {
  request(
    {
      url: testUrl,
      method: "PUT"
    },
    opts,
    (err, response, body) => {
      if (response) {
        console.log(
          `Send SMS to candidate ${name}, number: ${phoneNum}. Message: ${message}`
        );

        res.json({
          sendSMS: {
            success: true,
            to: `${name}`,
            phone: `${phoneNum}`,
            message: `${message}`
          }
        });
      }
      if (err) {
        console.log(
          `couldn't send SMS to ${id} : ${name}, error in PUT request to bulksms.`
        );
        saveCandidate("5xx or Network err", id, name, res);
      }
    }
  );
};

module.exports = postCallSMS;
