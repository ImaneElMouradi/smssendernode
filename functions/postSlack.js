// incoming webhook in order to send messages to slack channel (real time)
// const slackHook = require("../config/keys").slackHook;
const request = require("request");

// I mean, why not? xd
const emojis = [
  ":persevere:",
  ":face_with_raised_eyebrow:",
  ":thinking_face:",
  ":disappointed_relieved:",
  ":confused:",
  ":scream:",
  ":cry:",
  ":sob:",
  ":astonished:",
  ":fearful:",
  ":cold_sweat:",
  ":skull:",
  ":weary:",
  ":dizzy_face:"
];

// function to send a real time message to slack whenever an SMS fails
const postSlack = (id, name, pb) => {
  const randomNum = Math.floor(Math.random() * 13);
  var payload = {
    text:
      "*Failed to send SMS* " +
      emojis[randomNum] +
      "\n" +
      "*Candidate ID:* " +
      id +
      "\n" +
      "*Name:* " +
      name +
      "\n" +
      "*Problem:* " +
      pb +
      "\n" +
      "--> For more details, please <http://localhost:3000| click here>"
  };
  payload = JSON.stringify(payload);

  request(
    { url: process.env.slackHook, body: payload, method: "POST" },
    (err, data) => {
      if (data) console.log(`Slack message: Fail SMS to candidateId: ${id}`);
      if (err) console.log(`Error: ${err}`);
    }
  );
};

module.exports = postSlack;
