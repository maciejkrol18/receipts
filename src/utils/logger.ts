export default function logger(message: string, type: 'info' | 'error' | 'warn') {
  console.log(`[${type.toUpperCase()} ${new Date().toLocaleTimeString()}] ${message}`)
}
