const assert = require("node:assert/strict");
const path = require("node:path");

const urlModelPath = path.resolve(__dirname, "../src/models/url.model.js");
const cacheServicePath = path.resolve(__dirname, "../src/services/cache.service.js");

const userId = "665f00000000000000000011";
const urlId = "665f00000000000000000022";

let updatedPayload = null;
let deletedCacheKey = null;

const existingUrl = {
  _id: urlId,
  userId,
  originalUrl: "https://example.com",
  shortCode: "protected-link",
  passwordHash: "existing-hash",
  isActive: true
};

const ShortUrlMock = {
  findOne(query) {
    return {
      lean() {
        if (query._id === urlId && String(query.userId) === userId) {
          return Promise.resolve(existingUrl);
        }

        return Promise.resolve(null);
      }
    };
  },
  findOneAndUpdate(_query, update) {
    updatedPayload = update.$set;

    return {
      lean() {
        return Promise.resolve({
          ...existingUrl,
          ...updatedPayload,
          _id: { toString: () => urlId }
        });
      }
    };
  }
};

require.cache[urlModelPath] = {
  id: urlModelPath,
  filename: urlModelPath,
  loaded: true,
  exports: ShortUrlMock
};

require.cache[cacheServicePath] = {
  id: cacheServicePath,
  filename: cacheServicePath,
  loaded: true,
  exports: {
    deleteRedirectCache: async (shortCode) => {
      deletedCacheKey = shortCode;
    }
  }
};

const { updateUrl } = require("../src/services/url.service");

const run = async () => {
  await updateUrl({
    userId,
    urlId,
    updates: {
      originalUrl: "https://example.com",
      password: ""
    }
  });

  assert.equal(updatedPayload.passwordHash, null);
  assert.equal(Object.prototype.hasOwnProperty.call(updatedPayload, "password"), false);
  assert.equal(deletedCacheKey, "protected-link");

  console.log("Password removal verification passed.");
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
