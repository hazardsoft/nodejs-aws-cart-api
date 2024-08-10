import { Stack } from 'aws-cdk-lib'
import { CartServiceHandlers } from './constructs/handlers'
import type { Construct } from 'constructs'
import { config } from './config'
import { CartServiceDatabase } from './constructs/db'
import { CartServiceRestApi } from './constructs/restApi'
import { CartServiceNetwork } from './constructs/network'
import { createDatabaseUrl } from './helpers/db'
import { CartServiceHttpApi } from './constructs/httpApi'

export class CartService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      env: {
        account: config.account.id,
        region: config.account.region
      }
    })

    const network = new CartServiceNetwork(this, 'CartServiceNetwork')

    const db = new CartServiceDatabase(this, 'CartServiceDatabase', {
      database: {
        credentials: {
          username: config.database.credentials.username,
          password: config.database.credentials.password
        }
      },
      network: {
        vpc: network.vpc,
        vpcSubnets: network.getSubnetsForRDS(),
        securityGroups: network.getSecurityGroupsForRDS(),
        availabilityZone: network.availabilityZone
      }
    })

    const handlers = new CartServiceHandlers(this, 'CartServiceHandlers', {
      database: {
        url: createDatabaseUrl(
          config.database.credentials.username,
          config.database.credentials.password,
          db.db.instanceEndpoint.hostname,
          db.db.instanceEndpoint.port
        )
      },
      timeout: config.handlers.timeout,
      network: {
        vpc: network.vpc,
        vpcSubnets: network.getSubnetsForLambda(),
        securityGroups: network.getSecurityGroupsForLambda()
      }
    })

    db.db.grantConnect(handlers.cartHandler, config.database.credentials.username)

    new CartServiceRestApi(this, 'CartServiceApi', {
      cartHandler: handlers.cartHandler
    })

    new CartServiceHttpApi(this, 'CartServiceHttpApi', {
      serverUrl: config.servers.cart.url
    })
  }
}
