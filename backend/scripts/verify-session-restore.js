const assert = require("node:assert/strict");
const path = require("node:path");
const mongoose = require("mongoose");

const refreshTokenModelPath = path.resolve(__dirname, "../src/models/refresh-token.model.js");

const records = new Map();

const attachDocumentMethods = (record) => ({
  ...record,
  isActive() {
    return !this.revokedAt && this.expiresAt.getTime() > Date.now();
  },
  async save() {
    records.set(this._id.toString(), this);
    return this;
  }
});

const RefreshTokenMock = {
  async create(payload) {
    const record = attachDocumentMethods({
      ...payload,
      revokedAt: payload.revokedAt || null,
      replacedByTokenId: payload.replacedByTokenId || null
    });

    records.set(record._id.toString(), record);
    return record;
  },
  findOne(query) {
    return {
      populate() {
        const record = records.get(query._id.toString());

        if (!record || record.userId._id.toString() !== query.userId.toString()) {
          return Promise.resolve(null);
        }

        if (query.tokenHash && record.tokenHash !== query.tokenHash) {
          return Promise.resolve(null);
        }

        return Promise.resolve(record);
      }
    };
  }
};

require.cache[refreshTokenModelPath] = {
  id: refreshTokenModelPath,
  filename: refreshTokenModelPath,
  loaded: true,
  exports: RefreshTokenMock
};

const { createAuthTokens, rotateRefreshToken } = require("../src/services/token.service");

const user = {
  _id: new mongoose.Types.ObjectId(),
  role: "user",
  toSafeObject() {
    return {
      id: this._id.toString(),
      role: this.role
    };
  }
};

const req = {
  ip: "127.0.0.1",
  get(header) {
    return header.toLowerCase() === "user-agent" ? "session-restore-test" : null;
  }
};

const run = async () => {
  const initialTokens = await createAuthTokens({ user, req });
  const firstRefresh = await rotateRefreshToken({ refreshToken: initialTokens.refreshToken, req });
  const duplicateRefresh = await rotateRefreshToken({ refreshToken: initialTokens.refreshToken, req });

  assert.ok(firstRefresh.accessToken);
  assert.ok(firstRefresh.refreshToken);
  assert.ok(duplicateRefresh.accessToken);
  assert.equal(duplicateRefresh.refreshToken, null);
  assert.equal(duplicateRefresh.user._id.toString(), user._id.toString());

  console.log("Session restore duplicate refresh verification passed.");
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
