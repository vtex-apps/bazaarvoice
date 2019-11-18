import { canUseDOM } from 'vtex.render-runtime'
import { PixelMessage } from './typings/events'

export function handleEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    case 'vtex:orderPlaced': {
      const data = e.data
      const transactionData = {
        orderId: data.orderGroup,
        total: data.transactionSubtotal,
        currency: data.currency,
        tax: data.transactionTax,
        shipping: data.transactionShipping,
        country: data.visitorAddressCountry,
        state: data.visitorAddressState,
        email: data.visitorContactInfo[0],
        nickname: data.visitorContactInfo[1],
        items: data.transactionProducts.map(product => {
          return {
            sku: product.sku,
            quantity: product.quantity,
            name: product.name,
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