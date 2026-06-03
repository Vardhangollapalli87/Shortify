const http = require("http");

const port = process.env.PORT || 5000;
const path = "/api/v1/health";

const request = http.request(
  {
    hostname: "localhost",
    port,
    path,
    method: "GET",
    timeout: 5000
  },
  (response) => {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      process.exit(0);
    }

    process.exit(1);
  }
);

request.on("error", () => process.exit(1));
request.on("timeout", () => {
  request.destroy();
  process.exit(1);
});

request.end();
