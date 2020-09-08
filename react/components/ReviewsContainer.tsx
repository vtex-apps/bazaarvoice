import React, { FunctionComponent, Fragment } from 'react'
import { Dropdown } from 'vtex.styleguide'
import Review from './Review'
import { options, filters } from './utils/dropdownOptions'
import styles from '../styles.css'

const ReviewsContainer: FunctionComponent<ReviewsContainerProps> = ({
  count,
  handleSort,
  selected,
  props,
  handleFilter,
  filter,
  productIdentifier,
  linkText,
  reviews,
  appSettings,
}) => {
  return (
    <div className={styles.reviewsContainer}>
      <div className={styles.reviewsContainerHead}>
        <h4
          className={`${styles.reviewsContainerTitle} t-heading-4 bb b--muted-5 mb5 pb4`}
        >
          Reviewed by {count} {count == 1 ? 'customer' : 'customers'}
        </h4>
        <div className={`${styles.reviewsContainerDropdowns} flex mb7`}>
          <div className={`${styles.reviewsContainerSortDropdown} mr4`}>
            <Dropdown
              options={options}
              onChange={handleSort}
              value={selected}
              {...props}
            />
          </div>
          <div className={styles.reviewsContainerStarsDropdown}>
            <Dropdown
              options={filters}
              onChange={handleFilter}
              value={filter}
              {...props}
            />
          </div>
        </div>
        <div className={`${styles.reviewsContainerWriteButton} mt5 mb8`}>
          <a
            className={`${styles.writeReviewButton} bg-action-primary c-on-action-primary t-action link pv3 ph5`}
            href={`/new-review?product_id=${productIdentifier}&return_page=/${linkText}/p`}
          >
            {' '}
            Write a review{' '}
          </a>
        </div>
      </div>

      <Fragment>
              {reviews.map((review: any, i: number) => {
                  return <Review review={review} key={i} appSettings={appSettings} />
        })}
      </Fragment>
    </div>
  )
}

interface ReviewsContainerProps {
  count: number
  handleSort: any
  selected: string
  props: any
  productIdentifier: string
  linkText: string
  reviews: any[]
  handleFilter: any
  filter: string
  appSettings: any
}

export default ReviewsContainer
