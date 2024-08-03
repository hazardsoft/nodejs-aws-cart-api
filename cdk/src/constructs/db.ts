import { Duration, SecretValue } from 'aws-cdk-lib'
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Port,
  type ISecurityGroup,
  type IVpc,
  type SubnetSelection
} from 'aws-cdk-lib/aws-ec2'
import { RetentionDays } from 'aws-cdk-lib/aws-logs'
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  PerformanceInsightRetention,
  PostgresEngineVersion,
  StorageType,
  type IDatabaseInstance
} from 'aws-cdk-lib/aws-rds'
import { Construct } from 'constructs'

interface CartServiceDatabaseProps {
  database: {
    credentials: {
      username: string
      password: string
    }
  }
  network: {
    vpc: IVpc
    vpcSubnets: SubnetSelection
    securityGroups: ISecurityGroup[]
    availabilityZone: string
  }
}

export class CartServiceDatabase extends Construct {
  public readonly db: IDatabaseInstance

  constructor(scope: Construct, id: string, props: CartServiceDatabaseProps) {
    super(scope, id)

    this.db = new DatabaseInstance(this, 'CartServiceDatabase', {
      engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_16_3 }),
      multiAz: false,
      availabilityZone: props.network.availabilityZone,
      credentials: Credentials.fromPassword(
        props.database.credentials.username,
        SecretValue.unsafePlainText(props.database.credentials.password)
      ),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      storageType: StorageType.GP2,
      allocatedStorage: 20,
      vpc: props.network.vpc,
      vpcSubnets: props.network.vpcSubnets,
      securityGroups: props.network.securityGroups,
      publiclyAccessible: false,
      port: Number(Port.POSTGRES.toString()),
      performanceInsightRetention: PerformanceInsightRetention.DEFAULT,
      backupRetention: Duration.seconds(0),
      storageEncrypted: true,
      allowMajorVersionUpgrade: false,
      deletionProtection: false,
      cloudwatchLogsRetention: RetentionDays.ONE_DAY
    })
  }
}
