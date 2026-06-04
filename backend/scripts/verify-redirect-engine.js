const assert = require("node:assert/strict");
const path = require("node:path");
const bcrypt = require("bcrypt");

const urlModelPath = path.resolve(__dirname, "../src/models/url.model.js");
const cacheServicePath = path.resolve(__dirname, "../src/services/cache.service.js");
const clickModelPath = path.resolve(__dirname, "../src/models/click.model.js");

const now = Date.now();
const passwordHash = bcrypt.hashSync("secret", 8);

const urls = new Map([
  [
    "active",
    {
      _id: { toString: () => "665f00000000000000000001" },
      userId: { toString: () => "665f00000000000000000011" },
      originalUrl: "https://example.com/active",
      shortCode: "active",
      isActive: true,
      expiresAt: null,
      passwordHash: null
    }
  ],
  [
    "disabled",
    {
      _id: { toString: () => "665f00000000000000000002" },
      userId: { toString: () => "665f00000000000000000011" },
      originalUrl: "https://example.com/disabled",
      shortCode: "disabled",
      isActive: false,
      expiresAt: null,
      passwordHash: null
    }
  ],
  [
    "expired",
    {
      _id: { toString: () => "665f00000000000000000003" },
      userId: { toString: () => "665f00000000000000000011" },
      originalUrl: "https://example.com/expired",
      shortCode: "expired",
      isActive: true,
      expiresAt: new Date(now - 60 * 1000),
      passwordHash: null
    }
  ],
  [
    "protected",
    {
      _id: { toString: () => "665f00000000000000000004" },
      userId: { toString: () => "665f00000000000000000011" },
      originalUrl: "https://example.com/protected",
      shortCode: "protected",
      isActive: true,
      expiresAt: null,
      passwordHash
    }
  ]
]);

const cache = new Map();
let clickPayload = null;
let statsPayload = null;

const ShortUrlMock = {
  findOne(query) {
    return {
      select() {
        return Promise.resolve(urls.get(query.shortCode) || null);
      }
    };
  },
  updateOne(query, update) {
    statsPayload = { query, update };
    return Promise.resolve({ acknowledged: true });
  }
};

const ClickMock = {
  create(payload) {
    clickPayload = payload;
    return Promise.resolve(payload);
  }
};

require.cache[urlModelPath] = {
  id: urlModelPath,
  filename: urlModelPath,
  loaded: true,
  exports: ShortUrlMock
};

require.cache[clickModelPath] = {
  id: clickModelPath,
  filename: clickModelPath,
  loaded: true,
  exports: ClickMock
};

require.cache[cacheServicePath] = {
  id: cacheServicePath,
  filename: cacheServicePath,
  loaded: true,
  exports: {
    getRedirectCache: async (shortCode) => cache.get(shortCode) || null,
    setRedirectCache: async (shortCode, payload) => {
      cache.set(shortCode, payload);
    }
  }
};

const { resolveRedirect } = require("../src/services/redirect.service");
const { collectRedirectAnalyticsAsync } = require("../src/services/analytics.service");

const req = ({ password } = {}) => ({
  query: password ? { password } : {},
  headers: {
    "user-agent": "Mozilla/5.0 Chrome/120.0",
    "x-forwarded-for": "127.0.0.1",
    "x-country": "us"
  },
  socket: { remoteAddress: "127.0.0.1" },
  get(header) {
    const normalized = header.toLowerCase();
    return this.headers[normalized] || null;
  }
});

const expectCode = async (promise, code) => {
  await assert.rejects(promise, (error) => error.code === code);
};

const run = async () => {
  const active = await resolveRedirect({ shortCode: "active", req: req() });
  assert.equal(active.originalUrl, "https://example.com/active");
  assert.equal(cache.has("active"), true);

  await expectCode(resolveRedirect({ shortCode: "disabled", req: req() }), "LINK_DISABLED");
  await expectCode(resolveRedirect({ shortCode: "expired", req: req() }), "LINK_EXPIRED");
  await expectCode(resolveRedirect({ shortCode: "missing", req: req() }), "LINK_NOT_FOUND");
  await expectCode(resolveRedirect({ shortCode: "protected", req: req() }), "LINK_PASSWORD_REQUIRED");
  await expectCode(resolveRedirect({ shortCode: "protected", req: req({ password: "wrong" }) }), "LINK_PASSWORD_INVALID");

  const protectedLink = await resolveRedirect({ shortCode: "protected", req: req({ password: "secret" }) });
  assert.equal(protectedLink.originalUrl, "https://example.com/protected");

  collectRedirectAnalyticsAsync({ req: req(), url: active });
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(clickPayload.shortCode, "active");
  assert.equal(clickPayload.browser, "chrome");
  assert.equal(clickPayload.country, "US");
  assert.equal(statsPayload.query._id, active.id);
  assert.equal(statsPayload.update.$inc.totalClicks, 1);

  console.log("Redirect engine verification passed.");
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
