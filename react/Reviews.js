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
import { trackPageViewData } from './components/utils/trackers'
import styles from './styles.css'

import { Pagination, Modal } from 'vtex.styleguide'

const initialState = {
  reviews: null,
  average: 0,
  histogram: [],
  secondaryRatingsAverage: [],
  count: 0,
  percentage: [],
  selected: 'Helpfulness:desc,SubmissionTime:desc',
  loadedConfigData: false,
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
        secondaryRatingsAverage: action.secondaryRatingsAverage,
        percentage: action.percentage,
        count: action.count,
        paging: action.paging,
        hasError: false,
      }
    }
    case 'SET_LOADED_CONFIG_DATA': {
      return {
        ...state,
        loadedConfigData: true,
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

const useDefaultSort = (dispatch, loading, getConfig, loadedConfigData) => {
  useEffect(() => {
    if (!loading && !loadedConfigData) {
      dispatch({
        type: 'SET_LOADED_CONFIG_DATA',
      })
      if (getConfig.defaultOrdinationType) {
        dispatch({
          type: 'SET_SELECTED_SORT',
          selectedSort: getConfig.defaultOrdinationType,
        })
      }
    }
  }, [loading])
}

const Reviews = ({
  client,
  quantityPerPage = 10,
  quantityFirstPage = quantityPerPage,
  ...props
}) => {
  const { product } = useContext(ProductContext)
  const { linkText, productId, productReference } = product || {}

  const [state, dispatch] = useReducer(reducer, initialState)
  const { filter, selected, offset, count, histogram, average } = state

  const reviewsQuantityToShow =
    offset == 0 ? quantityFirstPage : quantityPerPage

  useDefaultSort(
    dispatch,
    props.data.loading,
    props.data.getConfig,
    state.loadedConfigData
  )

  useEffect(() => {
    if (!linkText && !productId && !productReference) {
      return
    }
    client
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
          quantity: reviewsQuantityToShow,
        },
      })
      .then(response => {
        let rollup = response.data.productReviews.TotalResults
          ? response.data.productReviews.Includes.Products[0].ReviewStatistics
          : null
        let reviews = response.data.productReviews.Results
        let paging = {
          pageSize: response.data.productReviews.Limit,
          totalResults: response.data.productReviews.TotalResults,
        }

        const currentHistogram = rollup != null ? rollup.RatingDistribution : []
        const currentCount = rollup != null ? rollup.TotalReviewCount : 0
        const currentAverage = rollup != null ? rollup.AverageOverallRating : 0
        const currentSecondaryRatingsAverages =
          rollup != null ? rollup.SecondaryRatingsAverages : []
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
          secondaryRatingsAverage: currentSecondaryRatingsAverages,
          paging,
          percentage,
        })
        if (state.loadedConfigData) {
          trackPageViewData(productId, 'Product', state.count)
        }
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
    average,
    linkText,
    productId,
    productReference,
    client,
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
  const fixedAverage = average.toFixed(1)
  return state.reviews.length ? (
    <div
      id="reviews"
      ref={containerRef}
      className={`${styles.reviews} mw8 center`}
    >
      <h3 className={`${styles.reviewsTitle} t-heading-3 b--muted-5 mb5`}>
        Reviews
      </h3>
      <div className="review__rating pb4">
        <Stars rating={fixedAverage} />
        <span className="review__rating--average dib v-mid c-muted-1">
          ({fixedAverage})
        </span>
      </div>
      <Histogram
        percentages={state.percentage}
        histogram={histogram}
        secondaryRatingsAverage={state.secondaryRatingsAverage}
      />
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
    <NoReviews
      productReference={productReference}
      linkText={linkText}
      handleSort={handleSort}
      selected={selected}
      props={props}
      handleFilter={handleFilter}
      filter={filter}
    />
  )
}

const withGetConfig = graphql(getConfig, {
  options: () => ({
    ssr: false,
  }),
})

Reviews.schema = {
  title: 'Reviews',
  type: 'object',
  properties: {
    quantityPerPage: {
      type: 'number',
      title: 'Quantity of Reviews per Page',
    },
    quantityFirstPage: {
      type: 'number',
      title: 'Quantity of Reviews on the First Page',
    },
  },
}

export default withApollo(withGetConfig(Reviews))
