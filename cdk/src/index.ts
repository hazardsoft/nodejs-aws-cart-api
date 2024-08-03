import { App } from 'aws-cdk-lib'
import { CartService } from './stack'

export const cartService = new CartService(new App(), 'CartService')
