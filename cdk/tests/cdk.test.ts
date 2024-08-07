import { cartService } from '@/index.js'
import { Template } from 'aws-cdk-lib/assertions'
import { describe, test } from 'vitest'

describe('Cart Service AWS CDK Stack Tests', () => {
  const template = Template.fromStack(cartService)

  test('should have 1 lambda', () => {
    template.resourceCountIs('AWS::Lambda::Function', 1)

    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'cart.handler'
    })
  })

  test('should have 3 security groups with ingress/egress rules', () => {
    template.resourceCountIs('AWS::EC2::SecurityGroup', 2)
    template.resourceCountIs('AWS::EC2::SecurityGroupIngress', 1)
    template.resourceCountIs('AWS::EC2::SecurityGroupEgress', 1)

    template.hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: 'Security group for cart service (RDS to Lambda)'
    })
    template.hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: 'Security group for cart service (Lambda to RDS)'
    })
  })

  test('should have 1 RDS instance', () => {
    template.resourceCountIs('AWS::RDS::DBInstance', 1)

    template.hasResourceProperties('AWS::RDS::DBInstance', {
      AllocatedStorage: '20',
      StorageType: 'gp2',
      BackupRetentionPeriod: 0,
      DBInstanceClass: 'db.t3.micro',
      Engine: 'postgres',
      MultiAZ: false,
      PubliclyAccessible: false
    })
  })

  test('should have REST API', () => {
    template.resourceCountIs('AWS::ApiGateway::RestApi', 1)

    template.resourceCountIs('AWS::ApiGateway::Resource', 1)
    template.hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: '{proxy+}'
    })

    template.resourceCountIs('AWS::ApiGateway::Method', 2)
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'ANY'
    })
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS'
    })
  })

  test('should have HTTP API', () => {
    template.resourceCountIs('AWS::ApiGatewayV2::Api', 1)

    template.resourceCountIs('AWS::ApiGatewayV2::Route', 1)
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
      RouteKey: 'ANY /{proxy+}'
    })

    template.resourceCountIs('AWS::ApiGatewayV2::Integration', 1)
    template.hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationMethod: 'ANY',
      IntegrationType: 'HTTP_PROXY'
    })

  })
})
