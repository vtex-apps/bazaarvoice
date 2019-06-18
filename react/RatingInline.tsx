import React, {
  useContext,
  FunctionComponent,
  useState,
  useEffect,
} from 'react'
import { ProductSummaryContext } from 'vtex.product-summary'
import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import { withApollo } from 'react-apollo'

const RatingInline: FunctionComponent<RatingInlineProps> = props => {
  const { product } = useContext(ProductSummaryContext)

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

  return hasRating ? (
    <div className="review__rating mw8 center ph5">
      <div className="review__rating--stars dib relative v-mid mr2">
        <div className="review__rating--inactive nowrap">
          {[0, 1, 2, 3, 4].map((_, i) => {
            return i <= 3 ? (
              <svg
                className="mr2"
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill={'#eee'}
                viewBox="0 0 14.737 14"
              >
                <path
                  d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z"
                  transform="translate(0)"
                />
              </svg> // se o review.metrics.rating for 4, preenche 4 estrelas
            ) : (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill={'#eee'}
                viewBox="0 0 14.737 14"
              >
                <path
                  d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z"
                  transform="translate(0)"
                />
              </svg> // se o review.metrics.rating for 4, preenche 4 estrelas
            )
          })}
        </div>
        <div
          className="review__rating--active nowrap overflow-hidden absolute top-0-s left-0-s"
          style={{ width: average * 20 + '%' }}
        >
          {[0, 1, 2, 3, 4].map((_, i) => {
            return i <= 3 ? (
              <svg
                className="mr2"
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill={average > i ? '#fc0' : '#eee'}
                viewBox="0 0 14.737 14"
              >
                <path
                  d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z"
                  transform="translate(0)"
                />
              </svg> // se o review.metrics.rating for 4, preenche 4 estrelas
            ) : (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill={average > i ? '#fc0' : '#eee'}
                viewBox="0 0 14.737 14"
              >
                <path
                  d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z"
                  transform="translate(0)"
                />
              </svg> // se o review.metrics.rating for 4, preenche 4 estrelas
            )
          })}
        </div>
      </div>
    </div>
  ) : (
    <div className="review__rating mw8 center ph5">
      <div className="review__rating--stars dib relative v-mid mr2">
        <div className="review__rating--inactive nowrap">
          {[0, 1, 2, 3, 4].map((_, i) => {
            return (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#eee"
                viewBox="0 0 14.737 14"
              >
                <path
                  d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z"
                  transform="translate(0)"
                ></path>
              </svg>
            )
          })}
        </div>
      </div>
    </div>
  )
}
interface RatingInlineProps {
  productQuery: any
  client: any
}

export default withApollo(RatingInline)
