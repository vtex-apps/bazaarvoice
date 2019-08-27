import React, { FunctionComponent, Fragment } from 'react'
import {Dropdown} from 'vtex.styleguide'
import Review from './Review'

const options = [
  {
    label: 'Most Recent',
    value: 'SubmissionTime:desc',
  },
  {
    label: 'Most Relevant',
    value: 'Helpfulness:desc,SubmissionTime:desc',
  },
  {
    label: 'Highest to Lowest Rating',
    value: 'Rating:desc',
  },
  {
    label: 'Lowest to Highest Rating',
    value: 'Rating:asc',
  },
  {
    label: 'Most Helpful',
    value: 'Helpfulness:desc',
  },
]

const filters = [
  {
    label: 'All',
    value: '0',
  },
  {
    label: '1 star',
    value: '1',
  },
  {
    label: '2 stars',
    value: '2',
  },
  {
    label: '3 stars',
    value: '3',
  },
  {
    label: '4 stars',
    value: '4',
  },
  {
    label: '5 stars',
    value: '5',
  },
]

const ReviewsContainer: FunctionComponent<ReviewsContainerProps> = ({count, handleSort, selected, props, handleFilter, filter, productReference, linkText, reviews}) => {
  return (
    <div className="review__comments">
        <div className="review__comments_head">
          <h4 className="review__comments_title t-heading-4 bb b--muted-5 mb5 pb4">
            Reviewed by {count}{' '}
            {count == 1 ? 'customer' : 'customers'}
          </h4>
          <div className="flex mb7">
            <div className="mr4">
              <Dropdown
                options={options}
                onChange={handleSort}
                value={selected}
                {...props}
              />
            </div>
            <div className="">
              <Dropdown
                options={filters}
                onChange={handleFilter}
                value={filter}
                {...props}
              />
            </div>
          </div>
          <div className="mv5">
            <a
              href={`/new-review?product_id=${productReference}&return_page=/${linkText}/p`}
            >
              {' '}
              Write a review{' '}
            </a>
          </div>
        </div>

        <Fragment>
          {reviews.map((review: any, i: number) => {
            return <Review review={review} key={i} />
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
  productReference: string
  linkText: string
  reviews: Array<any>
  handleFilter: any
  filter: string
}

export default ReviewsContainer