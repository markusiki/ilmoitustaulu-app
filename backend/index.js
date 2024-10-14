const app = require("./app");
const http = require("http");
const config = require("./utils/config");

const server = http.createServer(app);

server.listen(config.PORT || 3000, () => {
  console.log(`Server running on port ${config.PORT}`);
});
