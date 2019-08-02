const customizeSMS = (message, name) => {
  switch (message) {
    case "send-quiz":
      return `Congratulations ${name}! You have been selected to move to the next step of the hiring process at United Remote. We kindly ask that you complete one of the short tech quizzes sent to you on your email address.`;
    case "send-challenge":
      return `Congratulations ${name}! You have been selected to move to the 2nd step in the journey to join United Remote. Please check your email address for the coding challenge";`;
  }
};

module.exports = customizeSMS;
