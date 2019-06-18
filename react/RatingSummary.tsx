import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from 'react'
import { ProductContext } from 'vtex.product-context'
import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import { withApollo } from 'react-apollo'

const Reviews: FunctionComponent<ReviewProps> = props => {
  const { product } = useContext(ProductContext)

  const [average, setAverage] = useState(0)
  const [alreadyReviews, setAlreadyReviews] = useState(false)

  useEffect(() => {

    if(!product) {
      return
    }

    const getReviews = (orderBy: any, page: any) => {
      props.client.query({
        query: queryRatingSummary,
        variables: { sort: orderBy, page: page || 0, pageId: JSON.stringify({
          linkText: product.linkText,
          productId: product.productId,
          productReference: product.productReference,
        }), filter: 0 }
      }).then((response: any) => {
  
        let reviews = response.data.productReviews.Results;
  
        let rollup = response.data.productReviews.Includes.Products[0].ReviewStatistics
        
        setAverage(rollup != null ? rollup.average_rating : 0)
        setAlreadyReviews(reviews.length ? true : false)
  
      }).catch((error: any) => {
        console.log('ERROR: ', error)
      })
    }

    getReviews('Newest', 0)

  }, [product, props.client]) 

  return alreadyReviews ? (
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
              </svg>
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
              </svg>
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
              </svg>
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
              </svg>
            )
          })}
        </div>
      </div>
      <span className="review__rating--average dib v-mid">
        {average.toFixed(1)}
      </span>
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
      <span className="review__rating--average dib v-mid">0</span>
    </div>
  )
}
interface ReviewProps {
  client: any
}

export default withApollo(Reviews)