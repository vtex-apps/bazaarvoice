declare module 'vtex.product-summary' {
    import { Context } from 'react'

    interface ProductSummaryContext {
        product: any
    }

    export const ProductSummaryContext = Context
}