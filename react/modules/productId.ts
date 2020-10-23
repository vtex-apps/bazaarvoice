import { ProductOrder } from '../typings/events'
import { getSettings } from './settings'

const idMap = {
  productId: 'id',
  linkText: 'slug',
  productReference: 'productRefId',
} as const

export function getProductId(product: ProductOrder) {
  const settings = getSettings()
  const id = settings.uniqueId

  return product[idMap[id]]
}
