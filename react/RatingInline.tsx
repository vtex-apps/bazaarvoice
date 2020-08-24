import React, { FC } from 'react'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import { useQuery } from 'react-apollo'
import Stars from './components/Stars'

const RatingInline: FC = () => {
  const { product } = useProductSummary()

  const { data, loading, error } = useQuery(queryRatingSummary, {
    skip: !product,
    variables: {
      sort: 'SubmissionTime:desc',
      offset: 0,
      pageId: JSON.stringify({
        linkText: product && product.linkText,
        productId: product && product.productId,
        productReference: product && product.productReference,
      }),
    },
  })

  const average =
    !loading && !error && data && data.productReviews.Includes.Products[0]
      ? data.productReviews.Includes.Products[0].ReviewStatistics
          .AverageOverallRating
      : null

  return (
    <div className="review__rating mw8 center ph5">
      <Stars rating={average ? average : 0} />
    </div>
  )
}

export default RatingInline
