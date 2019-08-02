const verifyPhoneNumber = number => {
  number = number.replace(/([-._\s])/g, "");
  if (number.length == 10 && number[0] === "0") return true;
  else if (number.length == 13 && number.slice(0, 4) === "+212") return true;
  else return false;
};

module.exports = verifyPhoneNumber;
