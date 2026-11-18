import process from 'node:process'
import { app } from './app'
import { env } from './env'

app.listen(env.PORT)
process.stdout.write(`Server listening on http://localhost:${env.PORT}\n`)
