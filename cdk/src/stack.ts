import { Stack } from 'aws-cdk-lib'
import { CartServiceHandlers } from './constructs/handlers'
import type { Construct } from 'constructs'
import { config } from './config'
import { CartServiceDatabase } from './constructs/db'
import { CartServiceApi } from './constructs/api'

export class CartService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id)

    const handlers = new CartServiceHandlers(this, 'CartServiceHandlers', {
      database: {
        url: config.database.url
      }
    })

    new CartServiceDatabase(this, 'CartServiceDatabase', {
      handler: handlers.cartHandler,
      database: {
        credentials: {
          username: config.database.credentials.username,
          password: config.database.credentials.password
        },
        id: config.database.id,
        host: config.database.host,
        port: config.database.port
      }
    })

    new CartServiceApi(this, 'CartServiceApi', {
      cartHandler: handlers.cartHandler
    })
  }
}
