import { IOClients } from '@vtex/api'

import Reviews from './reviews'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get reviews() {
    return this.getOrSet('reviews', Reviews)
  }
}
