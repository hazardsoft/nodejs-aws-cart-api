import { Stack } from 'aws-cdk-lib'
import { CartServiceHandlers } from './constructs/handlers'
import type { Construct } from 'constructs'

export class CartService extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id)

    new CartServiceHandlers(this, 'CartServiceHandlers')
  }
}
