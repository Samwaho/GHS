const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || process.env.HOST || (dev ? 'localhost' : '0.0.0.0')
const port = parseInt(process.env.PORT, 10) || 3000

const app = next({
  dev,
  hostname,
  port,
})
const handle = app.getRequestHandler()

const shouldDisableCache = (req) => {
  if (dev) return false
  if (req.method !== 'GET') return false
  const accept = req.headers.accept || ''
  return accept.includes('text/html')
}

app
  .prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        if (shouldDisableCache(req)) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
          res.setHeader('Pragma', 'no-cache')
          res.setHeader('Expires', '0')
        }

        const parsedUrl = parse(req.url, true)
        await handle(req, res, parsedUrl)
      } catch (err) {
        console.error('Error occurred handling', req.url, err)
        res.statusCode = 500
        res.end('internal server error')
      }
    }).listen(port, hostname, (err) => {
      if (err) {
        console.error('Failed to start server', err)
        process.exit(1)
      }
      console.log(`> Ready on http://${hostname}:${port}`)
    })
  })
  .catch((err) => {
    console.error('Next.js failed to prepare the server', err)
    process.exit(1)
  })
