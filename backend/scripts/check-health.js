const http = require("http");

const port = process.env.PORT;
const hostname = process.env.HEALTHCHECK_HOST;
const path = process.env.HEALTHCHECK_PATH;

if (!port || !hostname || !path) {
  process.exit(1);
}

const request = http.request(
  {
    hostname,
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
