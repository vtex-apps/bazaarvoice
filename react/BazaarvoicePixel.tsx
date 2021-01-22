import { canUseDOM } from 'vtex.render-runtime'

import { PixelMessage } from './typings/events'
import { getProductId } from './modules/productId'

export function handleEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    case 'vtex:orderPlaced': {
      const { data } = e
      const transactionData = {
        orderId: data.orderGroup,
        total: (data.transactionSubtotal + data.transactionDiscounts).toFixed(
          2
        ),
        currency: data.currency,
        tax: data.transactionTax,
        shipping: data.transactionShipping,
        country: data.visitorAddressCountry,
        state: data.visitorAddressState,
        email: data.visitorContactInfo[0],
        nickname: data.visitorContactInfo[1],
        items: data.transactionProducts.map((product) => {
          return {
            productId: getProductId(product),
            sku: product.sku,
            discount: (product.originalPrice - product.price).toFixed(2),
            quantity: product.quantity,
            name: product.name,
            price: product.originalPrice.toFixed(2),
            category: product.category,
          }
        }),
      }

      window.BV.pixel.trackTransaction(transactionData)
      break
    }

    default: {
      break
    }
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleEvents)
}
