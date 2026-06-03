const sendResponse = (res, statusCode, data, message = null) => {
  const payload = {
    success: true,
    data
  };

  if (message) {
    payload.message = message;
  }

  return res.status(statusCode).json(payload);
};

module.exports = sendResponse;
