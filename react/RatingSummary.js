import React, { useContext, useState, useEffect, Fragment } from 'react'
import { ProductContext } from 'vtex.product-context'
import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import withGetConfig from './components/withGetConfig'
import { withApollo } from 'react-apollo'
import { Link } from 'vtex.render-runtime'
import Stars from './components/Stars'
import { FormattedMessage } from 'react-intl'

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

    const getReviews = (orderBy, offset) => {
      props.client
        .query({
          query: queryRatingSummary,
          variables: {
            sort: orderBy,
            offset: offset || 0,
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

          let rollup =
            response.data.productReviews.Includes.Products &&
            response.data.productReviews.Includes.Products[0].ReviewStatistics

          setAverage(rollup != null ? rollup.AverageOverallRating : 0)
          setTotalReviews(rollup != null ? rollup.TotalReviewCount : 0)
          setLoading(false)
        })
        .catch(error => {
          console.error('Bazzarvoice', error)
        })
    }

    getReviews('SubmissionTime:desc', 0)

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
            <Stars rating={average} />
          </div>
        ) : (
          <Fragment>
            <div className={`${styles.ratingSummaryStars} nowrap dib`}>
              <Stars rating={average} />
            </div>

            <span
              className={`${styles.ratingSummaryTotal} c-muted-2 t-body mr2`}
            >
              <a href="#bazaarvoice-reviews" className="c-link">
                <FormattedMessage
                  id="reviews"
                  values={{ total: totalReviews }}
                />
              </a>
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
