import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import type { IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

interface CartServiceRestApiProps {
  cartHandler: IFunction
}

export class CartServiceRestApi extends Construct {
  constructor(scope: Construct, id: string, props: CartServiceRestApiProps) {
    super(scope, id)

    const api = new RestApi(this, 'CartServiceApi')
    const root = api.root.addResource('{proxy+}')
    root.addMethod('ANY', new LambdaIntegration(props.cartHandler))
    root.addCorsPreflight({
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT'],
      allowHeaders: Cors.DEFAULT_HEADERS
    })
  }
}
