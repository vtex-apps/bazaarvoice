import React, {
  FunctionComponent,
  useState,
  useEffect,
} from 'react'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import { withApollo } from 'react-apollo'
import Stars from './components/Stars'

const RatingInline: FunctionComponent<RatingInlineProps> = props => {
  const { product } = useProductSummary()

  const [count, setCount] = useState(0)
  const [hasRating, setHasRating] = useState(false)
  const [average, setAverage] = useState(0)

  useEffect(() => {
    let ignore = false

    const getReviews = (orderBy: any, page: any) => {
      props.client
        .query({
          query: queryRatingSummary,
          variables: {
            sort: orderBy,
            page: page || 0,
            pageId: JSON.stringify({
              linkText: product.linkText,
              productId: product.productId,
              productReference: product.productReference,
            }),
          },
        })
        .then((response: any) => {
          if (ignore) {
            return
          }

          const productReviews = response.data.productReviews

          const results = productReviews.Results

          if (results.length) {
            setHasRating(true)
            setAverage(
              productReviews.Includes.Products[0].ReviewStatistics
                .AverageOverallRating
            )
          }

          setCount(count + 1)
        })
    }

    if (count == 0) {
      getReviews('SubmissionTime:asc', 0)
    }

    return () => {
      ignore = true
    }
  }, [count, product, props.client])

  return (
    <div className="review__rating mw8 center ph5">
      <Stars rating={hasRating ? average : 0} />
    </div>
  )
}
interface RatingInlineProps {
  productQuery: any
  client: any
}

export default withApollo(RatingInline)
