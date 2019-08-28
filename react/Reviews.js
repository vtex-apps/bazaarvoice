import React, {
  useContext,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from 'react'
import { ProductContext } from 'vtex.product-context'
import Stars from './components/Stars'
import Histogram from './components/Histogram'
import NoReviews from './components/NoReviews'
import ReviewsContainer from './components/ReviewsContainer'
import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import getConfig from './graphql/getConfig.gql'
import { withApollo, graphql } from 'react-apollo'
import styles from './styles.css'

import { Pagination, Modal } from 'vtex.styleguide'

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
        <Stars rating={average.toFixed(1)} />
        <span className="review__rating--average dib v-mid c-muted-1">
          ({average.toFixed(1)})
        </span>
      </div>
      <Histogram percentage={state.percentage} histogram={histogram} />
      <ReviewsContainer
        count={count}
        handleSort={handleSort}
        selected={selected}
        props={props}
        handleFilter={handleFilter}
        filter={filter}
        productReference={productReference}
        linkText={linkText}
        reviews={state.reviews}
      />
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
    <NoReviews productReference={productReference} linkText={linkText} />
  )
}

const withGetConfig = graphql(getConfig, {
  options: () => ({
    ssr: false,
  }),
})

export default withApollo(withGetConfig(Reviews))
