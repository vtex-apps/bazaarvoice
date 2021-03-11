import React, { Fragment } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { useQuery } from 'react-apollo'
import { Link } from 'vtex.render-runtime'
import { FormattedMessage } from 'react-intl'

import Stars from './components/Stars'
import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import styles from './styles.css'
import AggregateStructuredData from './components/AggregateStructuredData'

const RatingSummary = ({ appSettings }: { appSettings: Settings }) => {
  const { product } = useProduct()

  const { data, loading, error } = useQuery(queryRatingSummary, {
    skip: !product,
    variables: {
      sort: 'SubmissionTime:desc',
      offset: 0,
      filter: 0,
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

  const totalReviews =
    !loading && !error && data && data.productReviews
      ? data.productReviews.TotalResults
      : null

  const { uniqueId } = appSettings

  return (
    <div className={styles.ratingSummary}>
      <div className={`${styles.ratingSummaryContainer} flex items-center`}>
        {loading ? (
          <div
            className={`${styles.ratingSummaryStars} ${styles['ratingSummaryStars--loading']} nowrap dib`}
          >
            <Stars rating={average} />
          </div>
        ) : (
          <Fragment>
            <AggregateStructuredData
              productName={product?.productName}
              productId={product?.productId}
              productUrl={product?.link}
              average={average}
              total={totalReviews}
            />
            <div className={`${styles.ratingSummaryStars} nowrap dib`}>
              <Stars rating={average} />
            </div>

            <span
              className={`${styles.ratingSummaryTotal} c-muted-2 t-body mr2`}
            >
              <a href="#reviews" className="c-link">
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
              <FormattedMessage id="store/bazaar-voice.write-a-review" />
            </Link>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default RatingSummary
