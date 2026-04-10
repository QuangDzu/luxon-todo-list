const crypto = require("crypto");
const { authSecret } = require("../config/jwt");

function base64Encode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const jwt = {
  sign(payload, secret) {
    const header = base64Encode(JSON.stringify({ alg: "HS256", typ: "JWT" }));

    const encodedPayload = base64Encode(JSON.stringify(payload));
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${header}.${encodedPayload}`);

    const signature = hmac.digest("base64url");
    const token = `${header}.${encodedPayload}.${signature}`;
    return token;
  },
};

module.exports = jwt;
