import React, { useContext, useState, useEffect, Fragment } from 'react'
import { ProductContext } from 'vtex.product-context'
import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import withGetConfig from './components/withGetConfig'
import { withApollo } from 'react-apollo'
import { Link } from 'vtex.render-runtime'
import Star from './components/Star'

import styles from './styles.css'

const Reviews = props => {
  const { product } = useContext(ProductContext)

  const [average, setAverage] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)

  const uniqueId =
    props.data && props.data.getConfig
      ? props.data.getConfig.uniqueId
      : 'productId'

  useEffect(() => {
    let ignore = false

    if (!product) {
      return
    }

    const getReviews = (orderBy, page) => {
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
            filter: 0,
          },
        })
        .then(response => {
          if (ignore) {
            return
          }

          let reviews = response.data.productReviews.Results

          let rollup =
            response.data.productReviews.Includes.Products &&
            response.data.productReviews.Includes.Products[0].ReviewStatistics

          setAverage(rollup != null ? rollup.average_rating : 0)
          setTotalReviews(reviews.length ? reviews.length : 0)
          setLoading(false)
        })
        .catch(error => {
          console.log('ERROR: ', error)
        })
    }

    getReviews('Newest', 0)

    return () => {
      ignore = true
    }
  }, [product, props.client])

  return (
    <div className={styles.ratingSummary}>
      <div className={`${styles.ratingSummaryContainer} flex items-center`}>
        {loading ? (
          <div
            className={`${styles.ratingSummaryStars} ${
              styles['ratingSummaryStars--loading']
            } nowrap dib`}
          >
            {[0, 1, 2, 3, 4].map((_, index) => (
              <Star key={`${index + 'false'}`} fill={false} />
            ))}
          </div>
        ) : (
          <Fragment>
            <div className={`${styles.ratingSummaryStars} nowrap dib`}>
              {[0, 1, 2, 3, 4].map((_, index) => (
                <Star
                  key={`${index + average > index}`}
                  fill={average > index}
                />
              ))}
            </div>
            <span className={`${styles.ratingSummaryTotal} c-muted-2 t-body`}>
              ({totalReviews})
            </span>
            <Link
              className={`${styles.ratingSummaryWrite} ml2 c-link t-body`}
              href={`/new-review?product_id=${product[uniqueId]}&return_page=/${product.linkText}/p`}
            >
              Write a review
            </Link>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default withApollo(withGetConfig(Reviews))
