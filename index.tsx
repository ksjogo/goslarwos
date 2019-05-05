
import WebSocket from 'ws'
import express from 'express'
import render from './ssr'
import { createServer } from 'http'
import bodyParser from 'body-parser'

import usersCollection, { upsertUser, User } from './db'

const PORT = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())
const server = createServer(app)

// host the static clients files
app.use('/static', express.static('static'))

// pre-render users and send resulting html to web browser
app.get('/', async (req, res) => {
  const col = await usersCollection
  const users = await col.find().toArray()
  res.send(render(users))
})

/**
 * Should use the @slack/events-api, but the added token handling complexity makes it not worthwhile for the demo case
 */
app.post('/actions', async (req, res) => {
  const { challenge, event } = req.body
  if (challenge)
    return res.send({ challenge })

  console.log(req.body)

  switch (event.type) {
    case 'user_change':
    case 'team_join':
      const user = await upsertUser(event.user)
      propagate(user)
      break
    default:
      console.log('unhandled event')
      break
  }

  // let slack know that we processed the event to not receive it again
  return res.sendStatus(200)
})

// keep track of all websockets
const clients: Set<WebSocket> = new Set()

const wss = new WebSocket.Server({ server })
wss.on('connection', (ws) => {
  clients.add(ws)

  ws.on('close', () => {
    clients.delete(ws)
  })
})

// and send updated users to them
function propagate (user: User) {
  clients.forEach(client => {
    client.send(JSON.stringify({ user }))
  })
}

server.listen(PORT, () => console.log(`Listening on port ${PORT}!`))

usersCollection.then(db => console.log('db inited')).catch(error => console.error(error))
