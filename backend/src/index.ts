import app from './app'
import http from "http";
import config from "./utils/config";

const server = http.createServer(app);

server.listen(config.PORT || 3000, () => {
  console.log(`Server running on port ${config.PORT}`);
});
