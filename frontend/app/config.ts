let host: string;

if (typeof window !== 'undefined') {
  host = import.meta.env.MODE === 'production' ? window.location.origin : import.meta.env.VITE_HOST;
} else {
  host = import.meta.env.VITE_HOST;
}

export default { host };