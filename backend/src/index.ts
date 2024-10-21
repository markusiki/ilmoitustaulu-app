import app from './app'
import http from "http";
import { WebSocketServer } from 'ws';

import config from "./utils/config";
import { setupWebSocket } from './controllers/webSocketController';


const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true })

setupWebSocket(wss)

server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url!, `http://${request.headers.host}`).pathname;

  if (pathname === '/api/announcements') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  
  } else {
    socket.destroy();
  }
});
 
server.listen(config.PORT || 3000, () => {
  console.log(`Server running on port ${config.PORT}`);
});


export default wss
