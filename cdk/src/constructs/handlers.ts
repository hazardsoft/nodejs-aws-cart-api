import { Code, Function as LambdaFunction, Runtime, type IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

export class CartServiceHandlers extends Construct {
  public readonly cartHandler: IFunction

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.cartHandler = new LambdaFunction(this, 'CartHandler', {
      code: Code.fromAsset('../dist/handlers/cart'),
      handler: 'cart.handler',
      runtime: Runtime.NODEJS_20_X
    })
  }
}
