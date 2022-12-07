import { createConnection } from 'mongoose'

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI)
  throw new Error(
    'Please define the MONGO_URI environment variable inside .env'
  )

const connections: any = {}

async function db(dbName: string) {
  if (connections[dbName]) {
    return connections[dbName]
  } else {
    connections[dbName] = createConnection(`${MONGO_URI}/${dbName}`)
    return connections[dbName]
  }
}

export default db
