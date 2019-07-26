// a middleware for token verification

const verifyToken = (req, res, next) => {
  const token = req.header("smsender_token");
  if (!token) return res.status(401).send("Access denied");

  try {
    if (token === process.env.smsToken) {
      next();
    }
  } catch {
    res.status(400).send("Invalid token");
  }
};

module.exports = verifyToken;
