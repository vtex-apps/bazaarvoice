import { canUseDOM } from 'vtex.render-runtime'
import { PixelMessage } from './typings/events'

export function handleEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    case 'vtex:orderPlaced': {
      const data = e.data
      const transactionData = {
        orderId: data.orderGroup,
        total: data.transactionTotal,
        currency: data.currency,
        country: data.visitorAddressCountry,
        state: data.visitorAddressState,
        items: data.transactionProducts.map(product => {
          return {
            sku: product.sku,
            quantity: product.quantity,
            name: encodeURI(product.name),
            price: product.price,
            category: product.category
          }
        })
      }
      window.BV.pixel.trackTransaction(transactionData)
    }
    default: {
      return
    }
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleEvents)
}