import React, { FunctionComponent } from 'react'
import styles from '../styles.css'

const NoReviews: FunctionComponent<NoReviewsProps> = ({productReference, linkText}) => {
  return (
    <div className={`${styles.reviews} mw8 center c-on-base`}>
      <h3 className={`${styles.reviewsTitle} t-heading-3 b--muted-5 mb5`}>
        Reviews
      </h3>
      <div className={styles.reviewsContainer}>
        <div className={`${styles.noReviewsContainer} bw2 b--muted-5 mb5 pb3`}>
          <h5 className={`${styles.reviewsContainerTitle} lh-copy mw9 t-heading-5 mv5`}>
            No reviews found!
          </h5>
        </div>
        <div className={styles.reviewsContainerWriteButton}>
          <a
            href={`/new-review?product_id=${productReference}&return_page=/${linkText}/p`}
          >
            {' '}
            Be the first to write a review!{' '}
          </a>
        </div>
      </div>
    </div>
  )

}



interface NoReviewsProps {
  productReference: string
  linkText: string
}

export default NoReviews