const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");
const { authSecret, verifyEmailSecret } = require("../config/jwt");
const jwtUtils = require("../utils/jwt");
const strings = require("../utils/strings");
const {
  BCRYPT_SALT_ROUNDS,
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_DAYS,
  ERROR_MESSAGES,
  HTTP_STATUS,
} = require("../config/constants");
const emailService = require("../services/email.service");
const queueService = require("../services/queue.service");

const register = async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  try {
    const insertId = await userModel.create(email, hash);
    const newUser = {
      id: insertId,
      email,
    };

    // Send verify email
    // await emailService.sendVerifyEmail(newUser);
    await queueService.push({ type: "sendVerifyEmail", payload: newUser });

    res.success(newUser, HTTP_STATUS.CREATED);
  } catch (error) {
    if (String(error).includes("Duplicate")) {
      res.error("Email đã tồn tại", HTTP_STATUS.CONFLICT);
    } else {
      throw error;
    }
  }
};

const responseWithTokens = async (user) => {
  const accessTokenTtlMs = ACCESS_TOKEN_TTL_SECONDS * 1000;
  const refreshTokenTtlMs = REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

  const payload = { sub: user.id, exp: Date.now() + accessTokenTtlMs };
  const accessToken = jwtUtils.sign(payload, authSecret);
  const refreshToken = strings.createRandomString(32);
  const refreshTtl = new Date(Date.now() + refreshTokenTtlMs);

  await userModel.updateRefreshToken(user.id, refreshToken, refreshTtl);

  const response = {
    access_token: accessToken,
    access_token_ttl: 20,
    refresh_token: refreshToken,
    refresh_token_ttl: 60 * 60 * 24 * 30,
  };

  return response;
};

const login = async (req, res) => {
  const { email, password } = req.body;
  // const user = await userModel.findByEmailAndPassword(email, password);
  const user = await userModel.findByEmail(email);

  if (!user) {
    return res.error("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.error("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
  }

  const tokens = await responseWithTokens(user);
  res.success(user, HTTP_STATUS.OK, tokens);
};

const getCurrentUser = async (req, res) => {
  res.success(req.user);
};

const refreshToken = async (req, res) => {
  const refreshToken = req.body.refresh_token;
  const user = await userModel.findRefreshToken(refreshToken);

  if (!user) {
    return res.error("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
  }

  const tokens = await responseWithTokens(user);
  res.success(tokens);
};

const verifyEmail = async (req, res) => {
  const token = req.body.token;
  const payload = jwt.verify(token, verifyEmailSecret);

  if (payload.exp < Date.now()) {
    res.error("Token hết hạn");
    return;
  }

  const userId = payload.sub;
  await userModel.verifyEmail(userId);

  res.success("Verify email thành công");
};

const resendVerifyEmail = async (req, res) => {
  if (req.user.verify_at) {
    res.error("Tài khoản đã được xác minh!");
    return;
  }

  await queueService.push({
    type: "sendVerifyEmail",
    payload: {
      id: req.user.id,
      email: req.user.email,
    },
  });

  await emailService.sendVerifyEmail(req.user);
  res.success("Resend verify email thành công.");
};

module.exports = {
  register,
  login,
  getCurrentUser,
  refreshToken,
  verifyEmail,
  resendVerifyEmail,
};
