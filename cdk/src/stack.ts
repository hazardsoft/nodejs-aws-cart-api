import { Stack } from 'aws-cdk-lib'
import { CartServiceHandlers } from './constructs/handlers'
import type { Construct } from 'constructs'
import { config } from './config'
import { CartServiceDatabase } from './constructs/db'
import { CartServiceApi } from './constructs/api'
import { Vpc } from 'aws-cdk-lib/aws-ec2'

export class CartService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
      }
    })

    const vpc = Vpc.fromLookup(this, 'DefaultVpc', {
      isDefault: true
    })

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
        host: config.database.host,
        port: config.database.port
      },
      vpc
    })

    new CartServiceApi(this, 'CartServiceApi', {
      cartHandler: handlers.cartHandler
    })
  }
}
