import React, {
  useContext,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from 'react'
import { ProductContext } from 'vtex.product-context'
import Stars from './components/Stars'
import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import getConfig from './graphql/getConfig.gql'
import { withApollo, graphql } from 'react-apollo'
import styles from './styles.css'

import { Pagination, Dropdown, Modal } from 'vtex.styleguide'

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

const getTimeAgo = time => {
  let before = new Date(time)
  let now = new Date()
  let diff = new Date(now - before)

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

const initialState = {
  reviews: null,
  average: 0,
  histogram: [],
  count: 0,
  percentage: [],
  selected: 'SubmissionTime:desc',
  filter: '0',
  paging: {},
  offset: 0,
  hasError: false,
  isModalOpen: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_REVIEWS': {
      return {
        ...state,
        reviews: action.reviews,
        average: action.average,
        histogram: action.histogram,
        percentage: action.percentage,
        count: action.count,
        paging: action.paging,
        hasError: false,
      }
    }
    case 'SET_SELECTED_SORT': {
      return {
        ...state,
        selected: action.selectedSort,
      }
    }
    case 'SET_FILTER': {
      return {
        ...state,
        filter: action.filter,
        offset: 0,
      }
    }
    case 'SET_NEXT_PAGE': {
      return {
        ...state,
        offset: state.offset + state.paging.pageSize,
      }
    }
    case 'SET_PREVIOUS_PAGE': {
      return {
        ...state,
        offset: state.offset + state.paging.pageSize,
      }
    }
    case 'VOTE_REVIEW': {
      return {
        ...state,
        reviews: state.reviews.map((review, index) => {
          if (index === action.reviewIndex) {
            const types = {
              unhelpful: 'not_helpful_votes',
              helpful: 'helpful_votes',
            }
            const metricsType = types[action.voteType]

            return {
              ...review,
              disabled: true,
              metrics: {
                ...review.metrics,
                [metricsType]: (review.metrics[metricsType] += 1),
              },
            }
          }

          return review
        }),
      }
    }
    case 'TOGGLE_REVIEW_DETAILS': {
      return {
        ...state,
        reviews: state.reviews.map((review, index) => {
          if (index === action.reviewIndex) {
            return {
              ...review,
              showDetails: !review.showDetails,
            }
          }

          return review
        }),
      }
    }
    case 'QUERY_ERROR': {
      return {
        ...state,
        hasError: true,
      }
    }
    case 'TOGGLE_MODAL': {
      return {
        ...state,
        isModalOpen: !state.isModalOpen,
      }
    }
  }
}

const Reviews = props => {
  const { product } = useContext(ProductContext)
  const { linkText, productId, productReference } = product || {}

  const [state, dispatch] = useReducer(reducer, initialState)
  const { filter, selected, offset, count, histogram, average } = state

  useEffect(() => {
    if (!linkText && !productId && !productReference) {
      return
    }
    props.client
      .query({
        query: queryRatingSummary,
        variables: {
          sort: selected,
          offset: offset,
          pageId: JSON.stringify({
            linkText: linkText,
            productId: productId,
            productReference: productReference,
          }),
          filter: parseInt(filter) || 0,
        },
      })
      .then(response => {
        let rollup = response.data.productReviews.TotalResults
          ? response.data.productReviews.Includes.Products[0].ReviewStatistics
          : null
        let reviews = response.data.productReviews.Results // revisar se sempre vem 1 item nesse array
        let paging = {
          pageSize: response.data.productReviews.Limit,
          totalResults: response.data.productReviews.TotalResults,
        }

        const currentHistogram = rollup != null ? rollup.RatingDistribution : []
        const currentCount = rollup != null ? rollup.TotalReviewCount : 0
        const currentAverage = rollup != null ? rollup.AverageOverallRating : 0
        let percentage = []
        currentHistogram.forEach(val => {
          percentage.push(((100 / currentCount) * val.Count).toFixed(2) + '%') // percentage calculation
        })
        percentage.reverse() // layout starts from 5, hence the .reverse()

        dispatch({
          type: 'SET_REVIEWS',
          reviews: reviews,
          average: currentAverage,
          histogram: currentHistogram,
          count: currentCount,
          paging,
          percentage,
        })
      })
      .catch(error => {
        console.error('Bazzarvoice', error)
        dispatch({
          type: 'QUERY_ERROR',
        })
      })
  }, [
    filter,
    selected,
    offset,
    count,
    histogram,
    average,
    linkText,
    productId,
    productReference,
    props.client,
  ])

  const handleSort = useCallback(
    (event, value) => {
      dispatch({
        type: 'SET_SELECTED_SORT',
        selectedSort: value,
      })
    },
    [dispatch]
  )

  const handleFilter = useCallback(
    (event, value) => {
      dispatch({
        type: 'SET_FILTER',
        filter: value,
      })
    },
    [dispatch]
  )

  const containerRef = useRef()

  const scrollToReviews = () => {
    if (!containerRef.current) {
      return
    }
    containerRef.current.scrollIntoView()
  }

  const handleClickNext = useCallback(() => {
    dispatch({
      type: 'SET_NEXT_PAGE',
    })
    scrollToReviews()
  }, [dispatch])

  const handleClickPrevious = useCallback(() => {
    dispatch({
      type: 'SET_PREVIOUS_PAGE',
    })
    scrollToReviews()
  }, [dispatch])

  const handleModalToggle = useCallback(() => {
    dispatch({
      type: 'TOGGLE_MODAL',
    })
  }, [dispatch])

  if (state.hasError) {
    return <div></div>
  }

  if (state.reviews === null) {
    return <div className="review mw8 center ph5">Loading reviews</div>
  }

  return state.reviews.length ? (
    <div ref={containerRef} className={`${styles.reviews} mw8 center`}>
      <h3 className={`${styles.reviewsTitle} t-heading-3 bb b--muted-5 mb5`}>
        Reviews
      </h3>
      <div className="review__rating">
        <Stars rating={average} />
        <span className="review__rating--average dib v-mid c-muted-1">
          ({average.toFixed(1)})
        </span>
      </div>
      <div className="review__histogram">
        <ul className="bg-muted-5 pa7 list">
          {state.percentage.map((percentage, i) => {
            return (
              <li key={i} className="mv3">
                <span className="dib w-10 v-mid">
                  {5 - i} {i < 4 ? 'stars' : 'star'}
                </span>
                <div className="review__histogram--bar bg-white dib h2 w-90 v-mid">
                  <div
                    className="review__histogram--bar-value h2 bg-yellow"
                    style={{ width: percentage }}
                  ></div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="review__comments">
        <div className="review__comments_head">
          <h4 className="review__comments_title t-heading-4 bb b--muted-5 mb5 pb4">
            Reviewed by {state.count}{' '}
            {state.count == 1 ? 'customer' : 'customers'}
          </h4>
          <div className="flex mb7">
            <div className="mr4">
              <Dropdown
                options={options}
                onChange={handleSort}
                value={state.selected}
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

        {state.reviews.map((review, i) => {
          return (
            <div key={i} className="review__comment bw2 bb b--muted-5 mb5 pb4">
              <div className="review__comment--rating">
                {[0, 1, 2, 3, 4].map((_, j) => {
                  return (
                    <svg
                      className="mr3"
                      key={j}
                      xmlns="http://www.w3.org/2000/svg"
                      width="14.737"
                      height="14"
                      fill={review.Rating > j ? '#fc0' : '#eee'}
                      viewBox="0 0 14.737 14"
                    >
                      <path
                        d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z"
                        transform="translate(0)"
                      />
                    </svg> // se o review.Rating for 4, preenche 4 estrelas
                  )
                })}

                <span>{review.Rating}</span>
              </div>
              <h5 className="review__comment--user lh-copy mw9 t-heading-5 mv5">
                {review.Title}
              </h5>
              <ul className="pa0">
                <li className="dib mr5">
                  <strong>Submitted</strong> {getTimeAgo(review.SubmissionTime)}
                </li>
                <li className="dib mr5">
                  <strong>By</strong> {review.UserNickname}
                </li>
                <li className="dib">
                  <strong>From</strong> {review.UserLocation}
                </li>
              </ul>
              <p className="t-body lh-copy mw9">{review.ReviewText}</p>
              {review.Photos.length ? (
                <div className="review__comment-images mt6 flex items-start">
                  {review.Photos.map((item, i) => {
                    return (
                      <img
                        alt="Product"
                        className="w-20 db mb5"
                        onClick={() => openModalImage(item.Sizes.normal.Url)}
                        key={i}
                        src={item.Sizes.thumbnail.Url}
                      />
                    )
                  })}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
      <div className="review__paging">
        <Pagination
          currentItemFrom={1 + offset}
          currentItemTo={offset + state.paging.pageSize}
          textOf="of"
          totalItems={state.paging.totalResults}
          onNextClick={handleClickNext}
          onPrevClick={handleClickPrevious}
        />
      </div>
      <Modal centered isOpen={state.isModalOpen} onClose={handleModalToggle}>
        <img src={state.selectedImage} />
      </Modal>
    </div>
  ) : (
    <div className={`${styles.reviews} mw8 center c-on-base`}>
      <h3 className={`${styles.reviewsTitle} t-heading-3 b--muted-5 mb5`}>
        Reviews
      </h3>
      <div className="review__comments">
        <div className="review__comments_head">
          <h4 className="review__comments_title t-heading-4 bb b--muted-5 mb5 pb4">
            Reviewed by {state.count}{' '}
            {state.count == 1 ? 'customer' : 'customers'}
          </h4>
          <div className="flex mb7">
            <div className="mr4">
              <Dropdown
                options={options}
                onChange={handleSort}
                value={state.selected}
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

          {!props.data.loading && props.product && (
            <div className="mv5">
              <a
                href={`/new-review?product_id=${productReference}&return_page=/${linkText}/p`}
              >
                {' '}
                Write a review{' '}
              </a>
            </div>
          )}
        </div>

        <div className="review__comment bw2 bb b--muted-5 mb5 pb4">
          <h5 className="review__comment--user lh-copy mw9 t-heading-5 mv5">
            No reviews found!
          </h5>
        </div>
      </div>
    </div>
  )
}

const withGetConfig = graphql(getConfig, {
  options: () => ({
    ssr: false,
  }),
})

export default withApollo(withGetConfig(Reviews))
