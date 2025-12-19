import app from './app'
import config from './app/config'
import mongoose from 'mongoose'
import { Server } from 'http'
import seedSuperAdmin from './app/DB'

let server: Server

async function main() {
  try {
    await mongoose.connect(config.database_url as string)

    seedSuperAdmin()

    server = app.listen(config.port, () => {
      console.log(`Backend startup app listening on port ${config.port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

main()

// Error handling for asynchronous process
process.on('unhandledRejection', () => {
  console.log('unhandledRejection is detected, shutting down the server ...')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

// Error handling for error from developers logic
process.on('uncaughtException', () => {
  console.log('uncaughtException is detected, shutting down the server ...')

  process.exit(1)
})
