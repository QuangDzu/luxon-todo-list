const crypto = require("crypto");
const { authSecret } = require("../config/jwt");
const userModel = require("../models/user.model");

// function base64Encode(str) {
//   return btoa
//     .from(str)
//     .toString("base64")
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=+$/, "");
// }

const authRequired = async (req, res, next) => {
  const accessToken = req.headers.authorization?.replace("Bearer", "")?.trim();

  const [encodedHeader, encodedPayload, clientSignature] =
    accessToken?.split(".") ?? [];

  const hmac = crypto.createHmac("sha256", authSecret);
  hmac.update(`${encodedHeader}.${encodedPayload}`);

  const signature = hmac.digest("base64url");

  if (signature !== clientSignature) {
    return res.error("Unauthorized", 401);
  }

  const payload = JSON.parse(
    Buffer.from(encodedPayload, "base64url").toString(),
  );

  // Check exp
  if (payload.exp < Date.now()) {
    return res.error("Unauthorized", 401);
  }

  // Get current user
  const currentUser = await userModel.findOne(payload.sub);
  req.user = currentUser;

  next();
};

module.exports = authRequired;
