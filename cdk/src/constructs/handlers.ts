import { Duration } from 'aws-cdk-lib'
import { type ISecurityGroup, type IVpc, type SubnetSelection } from 'aws-cdk-lib/aws-ec2'
import { Code, Function as LambdaFunction, Runtime, type IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

interface CartServiceHandlersProps {
  database: {
    url: string
  }
  timeout: number
  network: {
    vpc: IVpc
    vpcSubnets: SubnetSelection
    securityGroups: ISecurityGroup[]
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
      timeout: Duration.seconds(props.timeout),
      vpc: props.network.vpc,
      vpcSubnets: props.network.vpcSubnets,
      securityGroups: props.network.securityGroups,
      allowPublicSubnet: true,
      environment: {
        DATABASE_URL: props.database.url
      }
    })
  }
}
