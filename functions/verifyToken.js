// a middleware for token verification

const smssender_token = "test";

const verifyToken = (req, res, next) => {
  const token = req.header("smsender_token");
  if (!token) return res.status(401).send("Access denied");

  try {
    if (token === smssender_token) {
      next();
    }
  } catch {
    res.status(400).send("Invalid token");
  }
};

module.exports = verifyToken;
