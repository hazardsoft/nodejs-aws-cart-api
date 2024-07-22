import { Code, Function as LambdaFunction, Runtime, type IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

interface CartServiceHandlersProps {
  database: {
    url: string
  }
}
export class CartServiceHandlers extends Construct {
  public readonly cartHandler: IFunction

  constructor(scope: Construct, id: string, props: CartServiceHandlersProps) {
    super(scope, id)

    this.cartHandler = new LambdaFunction(this, 'CartHandler', {
      code: Code.fromAsset('../dist/handlers/cart'),
      handler: 'cart.handler',
      runtime: Runtime.NODEJS_20_X,
      environment: {
        DATABASE_URL: props.database.url
      }
    })
  }
}
