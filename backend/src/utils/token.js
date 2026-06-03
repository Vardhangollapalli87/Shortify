const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

const signAccessToken = (user) => jwt.sign(
  {
    sub: user._id.toString(),
    role: user.role
  },
  env.jwtAccessSecret,
  {
    expiresIn: env.jwtAccessExpiresIn
  }
);

const signRefreshJwt = (user, tokenId) => jwt.sign(
  {
    sub: user._id.toString(),
    jti: tokenId.toString()
  },
  env.jwtRefreshSecret,
  {
    expiresIn: env.jwtRefreshExpiresIn
  }
);

const verifyAccessToken = (token) => jwt.verify(token, env.jwtAccessSecret);

const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret);

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const hashValue = (value) => {
  if (!value) return null;
  return crypto.createHash("sha256").update(value).digest("hex");
};

const durationToMilliseconds = (duration) => {
  const match = /^(\d+)([smhd])$/.exec(duration);

  if (!match) {
    return 30 * 24 * 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2];
  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return amount * units[unit];
};

module.exports = {
  signAccessToken,
  signRefreshJwt,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
  hashValue,
  durationToMilliseconds
};
