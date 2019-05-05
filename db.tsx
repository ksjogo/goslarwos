// eslint camelcase: "off"
import m from 'mongodb'
import mongodb from 'mongo-mock'
import console from 'console'
import { WebClient } from '@slack/web-api'
import fp from 'lodash/fp'
var MongoClient = mongodb.MongoClient

// should use env/secret manager, works for the demo
const slack = 'xoxp-626869693344-626869693680-' + (626333944581 - 1) + '-adc828e04c4f3deab6f36b06ce54c776'
const webClient = new WebClient(slack)

export type User = {
    id: string,
    name: string,
    real_name: string,
    profile: {
        display_name: string,
        image_72: string,
        status_text: string,
        status_emoji: string
    }
}

// extract relevant data for the UI
function simpleUser (user: any): User {
  return fp.pick([
    'id',
    'name',
    'real_name',
    'profile.display_name',
    'profile.image_72',
    'profile.status_text',
    'profile.status_emoji',
  ])(user) as any
}

// should use a real mongo instance, but the mock one has the same api and saves time in development setup
const p: Promise<m.MongoClient> = (MongoClient as any).connect('mongodb://localhost:27017/goslarwos')
// provide a permant resolvable promise for the user collection
const usersCollection = p.then(async (client) => {
  const db = client.db('goslarwos')
  const remoteUsers = await webClient.users.list()
  const users = (remoteUsers.members as any[]).map(simpleUser)
  console.log(users)
  const result = db.collection('users')
  await result.insertMany(users)
  // this ensure we have users initialised before any other call can access the db
  return result
})

// update a single user based on their slack-id
export async function upsertUser (rawUser: any) {
  const user = simpleUser(rawUser)
  const col = await usersCollection
  await col.updateOne({ id: user.id }, user, { upsert: true })
  return user
}

export default usersCollection
