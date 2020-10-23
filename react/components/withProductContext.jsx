import React, { useContext } from 'react'
import { ProductContext } from 'vtex.product-context'

function withProductContext(Component) {
  return function ProductContextWrapper(props) {
    const { product } = useContext(ProductContext)

    return <Component {...props} product={product} />
  }
}

export default withProductContext
