// a middleware for token verification

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).send({
      success: false,
      access: "denied",
      error: "Resource access requires authentication"
    });

  try {
    if (token === process.env.smsToken) {
      next();
    } else {
      res.status(400).json({
        success: false,
        access: "denied",
        error: "Invalid token"
      });
    }
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

module.exports = verifyToken;
