import { Duration, SecretValue } from 'aws-cdk-lib'
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
  type IVpc
} from 'aws-cdk-lib/aws-ec2'
import type { IFunction } from 'aws-cdk-lib/aws-lambda'
import { RetentionDays } from 'aws-cdk-lib/aws-logs'
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  PerformanceInsightRetention,
  PostgresEngineVersion,
  StorageType,
  SubnetGroup,
  type IDatabaseInstance
} from 'aws-cdk-lib/aws-rds'
import { Construct } from 'constructs'

interface CartServiceDatabaseProps {
  handler: IFunction
  database: {
    credentials: {
      username: string
      password: string
    }
    host: string
    port: number
  }
  vpc: IVpc
}

export class CartServiceDatabase extends Construct {
  public readonly db: IDatabaseInstance

  constructor(scope: Construct, id: string, props: CartServiceDatabaseProps) {
    super(scope, id)

    const subnetGroup = new SubnetGroup(this, 'CartServiceSubnetGroup', {
      description: 'Subnet group for cart database',
      vpc: props.vpc,
      vpcSubnets: {
        // by default private vpc private subnets are used
        // on this case vpc PUBLIC subnets are used to provide access to RDS instance from Internet
        subnets: props.vpc.publicSubnets
      }
    })

    const securityGroup = new SecurityGroup(this, 'CartServiceSecurityGroup', {
      description: 'Security group for cart service',
      allowAllOutbound: false,
      vpc: props.vpc
    })
    securityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(props.database.port),
      `Allow incoming traffic to ${props.database.port}/TCP from any IP v4`
    )
    securityGroup.addEgressRule(
      Peer.anyIpv4(),
      Port.tcp(props.database.port),
      `Allow outgoing traffic from ${props.database.port}/TCP to any IP v4`
    )

    this.db = new DatabaseInstance(this, 'CartServiceDatabase', {
      engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_16_3 }),
      multiAz: false,
      credentials: Credentials.fromPassword(
        props.database.credentials.username,
        SecretValue.unsafePlainText(props.database.credentials.password)
      ),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      storageType: StorageType.GP2,
      allocatedStorage: 20,
      vpc: props.vpc,
      subnetGroup: subnetGroup,
      securityGroups: [securityGroup],
      publiclyAccessible: true,
      port: props.database.port,
      performanceInsightRetention: PerformanceInsightRetention.DEFAULT,
      backupRetention: Duration.seconds(0),
      storageEncrypted: true,
      allowMajorVersionUpgrade: false,
      deletionProtection: false,
      cloudwatchLogsRetention: RetentionDays.ONE_DAY
    })

    this.db.grantConnect(props.handler, props.database.credentials.username)
  }
}
