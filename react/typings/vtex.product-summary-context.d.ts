declare module 'vtex.product-summary-context/ProductSummaryContext' {
  import { Context } from 'react'

  interface ProductSummaryContext {
    product: any
  }

  export function useProductSummary(): ProductSummaryContext
}
