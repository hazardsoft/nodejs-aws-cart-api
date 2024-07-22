import type { IFunction } from 'aws-cdk-lib/aws-lambda'
import { DatabaseInstance, type IDatabaseInstance } from 'aws-cdk-lib/aws-rds'
import { Construct } from 'constructs'

interface CartServiceDatabaseProps {
  handler: IFunction
  database: {
    credentials: {
      username: string
      password: string
    }
    id: string
    host: string
    port: number
  }
}

export class CartServiceDatabase extends Construct {
  public readonly db: IDatabaseInstance
  constructor(scope: Construct, id: string, props: CartServiceDatabaseProps) {
    super(scope, id)

    this.db = DatabaseInstance.fromDatabaseInstanceAttributes(this, 'CartServiceDatabase', {
      instanceIdentifier: props.database.id,
      instanceEndpointAddress: props.database.host,
      instanceResourceId: props.database.id,
      port: props.database.port,
      securityGroups: []
    })

    this.db.grantConnect(props.handler, props.database.credentials.username)
  }
}
