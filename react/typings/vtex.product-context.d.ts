declare module 'vtex.product-context' {
  import { Context } from 'react'

  interface ProductContext {
    product: any
  }

  export const ProductContext = Context
}

declare module 'vtex.product-context/useProduct' {
  import { Context } from 'react'

  interface ProductContext {
    product: any
  }

  export default function useProduct(): ProductContext
}
