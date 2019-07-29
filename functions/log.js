const fs = require("fs");
const util = require("util");

const logFile = fs.createWriteStream("log.txt", { flags: "a" });
const logStdout = process.stdout;
// overwrite console.log to save logs in log.txt and on console (default)
console.log = e => {
  logFile.write(util.format(e) + "\n");
  logStdout.write(util.format(e) + "\n");
};

module.exports = console.log;
