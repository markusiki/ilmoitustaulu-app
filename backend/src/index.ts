import app from './app'
import http from 'node:http'
import { WebSocketServer } from 'ws'

import config from './utils/config'
import { setupWebSocket } from './controllers/webSocketController'

import { authorizeConnection } from './utils/middleware'

export interface CustomHttpRequest extends http.IncomingMessage {

  access_token: string | undefined
}

const server = http.createServer(app)
const wss = new WebSocketServer({ noServer: true })

setupWebSocket(wss)

server.on('upgrade', (request: CustomHttpRequest, socket, head) => {
  const pathname = new URL(request.url!, `http://${request.headers.host}`)
    .pathname

  if (pathname === '/announcements/') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      const isAuthenticated = authorizeConnection(request)
      if (!isAuthenticated) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
        socket.destroy()
        return
      }
      wss.emit('connection', ws, request)
    })
  } else {
    socket.destroy()
  }
})

server.listen(config.PORT || 3000, () => {
  console.log(`Server running on port ${config.PORT}`)
})

export default wss
