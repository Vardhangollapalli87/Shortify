const mongoose = require("mongoose");
const RefreshToken = require("../models/refresh-token.model");
const {
  durationToMilliseconds,
  hashToken,
  hashValue,
  signAccessToken,
  signRefreshJwt,
  verifyRefreshToken
} = require("../utils/token");
const { env } = require("../config/env");

const createRefreshTokenRecord = async ({ user, req }) => {
  const expiresAt = new Date(Date.now() + durationToMilliseconds(env.jwtRefreshExpiresIn));
  const tokenId = new mongoose.Types.ObjectId();
  const refreshToken = signRefreshJwt(user, tokenId);

  const refreshTokenRecord = await RefreshToken.create({
    _id: tokenId,
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    userAgent: req.get("user-agent") || null,
    ipHash: hashValue(req.ip),
    expiresAt
  });

  return {
    refreshToken,
    refreshTokenRecord
  };
};

const createAuthTokens = async ({ user, req }) => {
  const accessToken = signAccessToken(user);
  const { refreshToken } = await createRefreshTokenRecord({ user, req });

  return {
    accessToken,
    refreshToken
  };
};

const rotateRefreshToken = async ({ refreshToken, req }) => {
  const decoded = verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);

  const currentToken = await RefreshToken.findOne({
    _id: decoded.jti,
    userId: decoded.sub,
    tokenHash
  }).populate("userId");

  if (!currentToken || !currentToken.isActive()) {
    return null;
  }

  const user = currentToken.userId;
  const { refreshToken: newRefreshToken, refreshTokenRecord } = await createRefreshTokenRecord({ user, req });

  currentToken.revokedAt = new Date();
  currentToken.replacedByTokenId = refreshTokenRecord._id;
  await currentToken.save();

  return {
    user,
    accessToken: signAccessToken(user),
    refreshToken: newRefreshToken
  };
};

const revokeRefreshToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);

  const tokenRecord = await RefreshToken.findOne({
    _id: decoded.jti,
    userId: decoded.sub,
    tokenHash
  });

  if (!tokenRecord || tokenRecord.revokedAt) {
    return false;
  }

  tokenRecord.revokedAt = new Date();
  await tokenRecord.save();

  return true;
};

module.exports = {
  createAuthTokens,
  rotateRefreshToken,
  revokeRefreshToken
};
