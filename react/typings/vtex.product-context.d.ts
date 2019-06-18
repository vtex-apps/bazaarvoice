declare module 'vtex.product-context' {
  import { Context } from 'react'

  interface ProductContext {
    product: any
  }

  export const ProductContext = Context
}
