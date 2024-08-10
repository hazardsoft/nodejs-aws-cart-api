import { CfnOutput } from 'aws-cdk-lib'
import { Cors } from 'aws-cdk-lib/aws-apigateway'
import { CorsHttpMethod, HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2'
import { HttpUrlIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { Construct } from 'constructs'

interface CartServiceHttpApiProps {
  serverUrl: string
}

export class CartServiceHttpApi extends Construct {
  constructor(scope: Construct, id: string, props: CartServiceHttpApiProps) {
    super(scope, id)

    const integration = new HttpUrlIntegration(
      'CartServiceHttpUrlIntegration',
      `${props.serverUrl}/{proxy}`
    )

    const api = new HttpApi(this, 'CartServiceHttpApi', {
      description: 'HTTP API to proxy requests to EC2 instance of Elastic Beanstalk application',
      corsPreflight: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT
        ]
      }
    })
    api.addRoutes({
      path: '/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: integration
    })

    new CfnOutput(this, 'CartServiceHttpApiUrl', { value: api.apiEndpoint })
  }
}
