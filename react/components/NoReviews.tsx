import React, { FunctionComponent } from 'react'
import { Dropdown } from 'vtex.styleguide'
import { options, filters } from './utils/dropdownOptions'
import styles from '../styles.css'

const NoReviews: FunctionComponent<NoReviewsProps> = ({
  productReference,
  linkText,
  handleSort,
  selected,
  props,
  handleFilter,
  filter,
}) => {
  const isAllReviewsFilter = filter == '0'
  return (
    <div className={`${styles.reviews} mw8 center c-on-base`}>
      <h3 className={`${styles.reviewsTitle} t-heading-3 b--muted-5 mb5`}>
        Reviews
      </h3>
      <div className={styles.reviewsContainer}>
        <div className={`${styles.noReviewsContainer} bw2 b--muted-5 mb5 pb3`}>
          <h5
            className={`${styles.reviewsContainerTitle} lh-copy mw9 t-heading-5 mv5`}
          >
            {isAllReviewsFilter
              ? 'There are no reviews for this product yet'
              : `There are no reviews with ${filter} ${
                  filter == '1' ? 'star' : 'stars'
                }`}
          </h5>
        </div>
        {!isAllReviewsFilter && (
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
        )}
        <div className={`${styles.reviewsContainerWriteButton} mb5`}>
          <a
            className={`${styles.writeReviewButton} bg-action-primary c-on-action-primary t-action link pv3 ph5`}
            href={`/new-review?product_id=${productReference}&return_page=/${linkText}/p`}
          >
            {isAllReviewsFilter
              ? 'Be the first to write a review!'
              : 'Write a review'}
          </a>
        </div>
      </div>
    </div>
  )
}

interface NoReviewsProps {
  productReference: string
  linkText: string
  handleSort: any
  selected: string
  props: any
  handleFilter: any
  filter: string
}

export default NoReviews
