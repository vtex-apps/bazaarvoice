import React, { FunctionComponent, useContext } from 'react'
import Stars from './Stars'
import HistogramBar from './HistogramBar'
import styles from '../styles.css'
import { useTrackImpression, useTrackInView, useTrackViewedCGC } from '../modules/trackers'
import { ProductContext } from 'vtex.product-context'
import ReviewStructuredData from './ReviewStructuredData'

const getTimeAgo = (time: string) => {
  let before = new Date(time)
  let now = new Date()
  let diff = new Date(now.valueOf() - before.valueOf())

  let minutes = diff.getUTCMinutes()
  let hours = diff.getUTCHours()
  let days = diff.getUTCDate() - 1
  let months = diff.getUTCMonth()
  let years = diff.getUTCFullYear() - 1970

  if (years != 0) {
    return `${years} ${years > 1 ? 'years' : 'year'} ago`
  } else if (months != 0) {
    return `${months} ${months > 1 ? 'months' : 'month'} ago`
  } else if (days != 0) {
    return `${days} ${days > 1 ? 'days' : 'day'} ago`
  } else if (hours != 0) {
    return `${hours} ${hours > 1 ? 'hours' : 'hour'} ago`
  } else {
    return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} ago`
  }
}

const elementId = (reviewId: string) => `bazaarvoice-review-${reviewId}`

const Review: FunctionComponent<ReviewProps> = ({ review }) => {
  const { product } = useContext(ProductContext)
  useTrackImpression(product.productId, review.Id)
  useTrackInView(product.productId, elementId(review.Id))
  useTrackViewedCGC(product.productId, elementId(review.Id))
  return (
    <div id={elementId(review.Id)} className={`${styles.review} bw2 bb b--muted-5 mb5 pb4-ns pb8-s`}>
      <ReviewStructuredData productName={product.productName} review={review} />
      <div className={`${styles.reviewRating} flex items-center`}>
        <Stars rating={review.Rating} />
        <span className="c-muted-1 t-small ml2">
          {getTimeAgo(review.SubmissionTime)}
        </span>
      </div>
      <h5 className={`${styles.reviewTitle} lh-copy mw7 t-heading-5 mv5`}>
        {review.Title}
      </h5>
      <div className="flex flex-column-s flex-row-ns">
        <div className="flex flex-grow-1 flex-column w-70-ns">
          <p className={`${styles.reviewText} t-body lh-copy mw7 pr5-ns`}>
            {review.ReviewText}
          </p>
          {review.Photos.length ? (
            <div
              className={`${styles.reviewImagesContainer} mt6 flex items-start`}
            >
              {review.Photos.map((item: any, i: number) => {
                return (
                  <img
                    alt="Product"
                    className={`${styles.reviewImage} w-20 db mb5`}
                    key={i}
                    src={item.Sizes.thumbnail.Url}
                  />
                )
              })}
            </div>
          ) : null}
          <div className={`${styles.reviewByField} t-small c-muted-1`}>
            {review.UserNickname} {review.UserLocation && `, from ${review.UserLocation}`}
          </div>
        </div>
        {review.SecondaryRatings && (
          <ul className="flex flex-grow-1 flex-column pl0 pl3-ns list">
            {review.SecondaryRatings.map((rating: any, i: number) => {
              if (rating == null) {
                return <li key={i} />
              }

              return (
                <li
                  key={i}
                  className={`${styles.secondaryHistogramLine} mv3 flex flex-column`}
                >
                  <div
                    className={`${styles.secondaryHistogramLabel} dib v-mid nowrap pr2`}
                  >
                    {rating.Label}
                  </div>
                  <HistogramBar
                    barClassName={styles.reviewHistogramBar}
                    barValueClassName={styles.reviewHistogramBarValue}
                    percentage={`${rating.Value * 20}%`}
                    shouldShowDivisions
                  />
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

interface ReviewProps {
  review: any
}

export default Review
