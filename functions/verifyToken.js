// a middleware for token verification

const verifyToken = (req, res, next) => {
  const token = req.header("smsender_token");
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
  } catch {
    res.status(400).send("Invalid token");
  }
};

module.exports = verifyToken;
