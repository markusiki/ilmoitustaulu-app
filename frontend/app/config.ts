let ws_host: string
let host: string;

const mode = import.meta.env.MODE
if (typeof window !== 'undefined') {
  ws_host = mode === 'production' ? `wss://${window.location.host}` : 'ws://localhost:5000'
  host = mode === 'production' ? window.location.origin : import.meta.env.VITE_HOST;
} else {
  ws_host = 'ws://localhost:5000'
  host = import.meta.env.VITE_HOST;
}

export default { ws_host, host };