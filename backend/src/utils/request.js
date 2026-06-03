const getClientIp = (req) => req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

const getUserAgent = (req) => req.get("user-agent") || "";

module.exports = {
  getClientIp,
  getUserAgent
};
