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
const postCallSMS = (res, phoneNum, id, first_name, last_name, message) => {
  request(
    {
      url: `https://bulksms.ma/developer/sms/send?token=${
        process.env.bulksmsToken
      }&tel=${phoneNum}&message=${message}`,
      method: "POST",
      json: true,
      body: {
        success: true,
        to: `${first_name} ${last_name}`,
        phone: `${phoneNum}`,
        message: `${message}`
      }
    },
    opts,
    (err, response, body) => {
      if (response) {
        console.log("send SMS to " + phoneNum + ". Message: " + message);

        res.json({
          sendSMS: {
            success: true,
            to: `${first_name} ${last_name}`,
            phone: `${phoneNum}`,
            message: `${message}`
          }
        });
      }
      if (err) {
        console.log(
          `sms fail to ${id} ${last_name} ${first_name}, error: ${err}`
        );
        saveCandidate("5xx or Network err", id, first_name, last_name, res);
      }
    }
  );
};

module.exports = postCallSMS;
