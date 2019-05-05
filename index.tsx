
import WebSocket from 'ws'
import express from 'express'
import render from './ssr'

const HTTP_PORT = 3000
const WS_PORT = 3001

const app = express()

app.use('/static', express.static('static'))

app.get('/', (req, res) => {
  res.send(render())
})

app.listen(HTTP_PORT, () => console.log(`Example app listening on port ${HTTP_PORT}!`))

const clients: Set<WebSocket> = new Set()

const wss = new WebSocket.Server({ port: WS_PORT })
wss.on('connection', (ws) => {
  clients.add(ws)

  ws.on('message', (message) => {
    console.log('received from ws: %s', message)
  })

  ws.on('close', () => {
    clients.delete(ws)
  })

  ws.send('connected')
})
