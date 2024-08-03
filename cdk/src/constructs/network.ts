import {
  Peer,
  Port,
  SecurityGroup,
  Vpc,
  type ISecurityGroup,
  type IVpc,
  type SubnetSelection
} from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'

export class CartServiceNetwork extends Construct {
  public readonly vpc: IVpc
  public readonly availabilityZone: string
  private readonly internet2RDSPublicSecurityGroup: ISecurityGroup
  private readonly rds2LambdaPrivateSecurityGroup: ISecurityGroup
  private readonly lambda2RDSPrivateSecurityGroup: ISecurityGroup

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.vpc = Vpc.fromLookup(this, 'DefaultVpc', {
      isDefault: true
    })

    this.availabilityZone = this.vpc.availabilityZones[0] ?? ''
    if (!this.availabilityZone) throw new Error('No availability zone found')

    this.rds2LambdaPrivateSecurityGroup = new SecurityGroup(this, 'RDS2LambdaSecurityGroup', {
      description: 'Security group for cart service (RDS to Lambda)',
      allowAllOutbound: false,
      vpc: this.vpc
    })
    this.internet2RDSPublicSecurityGroup = new SecurityGroup(this, 'Internet2RDSSecurityGroup', {
      description: 'Security group for cart service (Internet to RDS)',
      allowAllOutbound: false,
      vpc: this.vpc
    })
    this.lambda2RDSPrivateSecurityGroup = new SecurityGroup(this, 'Lambda2RDSSecurityGroup', {
      description: 'Security group for cart service (Lambda to RDS)',
      allowAllOutbound: false,
      vpc: this.vpc
    })

    this.rds2LambdaPrivateSecurityGroup.addIngressRule(
      this.lambda2RDSPrivateSecurityGroup,
      Port.POSTGRES,
      'Allow incoming traffic from Lambda'
    )
    this.lambda2RDSPrivateSecurityGroup.addEgressRule(
      this.rds2LambdaPrivateSecurityGroup,
      Port.POSTGRES,
      'Allow outgoing traffic to RDS'
    )
    this.internet2RDSPublicSecurityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.POSTGRES,
      `Allow incoming traffic to Postgres from any IP v4`
    )
  }

  getSubnetsForLambda(): SubnetSelection {
    return this.vpc.selectSubnets({
      availabilityZones: [this.availabilityZone]
    })
  }

  getSubnetsForRDS(): SubnetSelection {
    return { subnets: this.vpc.publicSubnets }
  }

  getSecurityGroupsForRDS(): ISecurityGroup[] {
    return [this.rds2LambdaPrivateSecurityGroup, this.internet2RDSPublicSecurityGroup]
  }

  getSecurityGroupsForLambda(): ISecurityGroup[] {
    return [this.lambda2RDSPrivateSecurityGroup]
  }
}
