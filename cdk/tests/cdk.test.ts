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
})
