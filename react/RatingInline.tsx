import React, { FC } from 'react'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import { useQuery } from 'react-apollo'

import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import Stars from './components/Stars'

const RatingInline: FC = () => {
  const { product } = useProductSummary()

  const { data, loading, error } = useQuery(queryRatingSummary, {
    skip: !product,
    variables: {
      sort: 'SubmissionTime:desc',
      offset: 0,
      pageId: JSON.stringify({
        linkText: product?.linkText,
        productId: product?.productId,
        productReference: product?.productReference,
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
      <Stars rating={average || 0} />
    </div>
  )
}

export default RatingInline
