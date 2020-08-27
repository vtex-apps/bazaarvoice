import React, {
  useContext,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from 'react'
import { ProductContext } from 'vtex.product-context'
import { withApollo } from 'react-apollo'
import { Pagination, Modal } from 'vtex.styleguide'

import Stars from './components/Stars'
import Histogram from './components/Histogram'
import NoReviews from './components/NoReviews'
import ReviewsContainer from './components/ReviewsContainer'
import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import { trackPageViewData } from './modules/trackers'
import styles from './styles.css'
import AggregateStructuredData from './components/AggregateStructuredData'

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
        offset: Math.max(0, state.offset - state.paging.pageSize),
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

    // no default
  }
}

const useDefaultSort = (dispatch, appSettings, loadedConfigData) => {
  useEffect(() => {
    if (!appSettings && !loadedConfigData) {
      dispatch({
        type: 'SET_LOADED_CONFIG_DATA',
      })
      if (appSettings.defaultOrdinationType) {
        dispatch({
          type: 'SET_SELECTED_SORT',
          selectedSort: appSettings.defaultOrdinationType,
        })
      }
    }
  }, [appSettings, dispatch, loadedConfigData])
}

const Reviews = ({
  client,
  quantityPerPage = 10,
  quantityFirstPage = quantityPerPage,
  appSettings,
  ...props
}) => {
  const { product } = useContext(ProductContext)
  const { linkText, productId, productReference } = product || {}

  const [state, dispatch] = useReducer(reducer, initialState)
  const { filter, selected, offset, count, histogram, average } = state

  const reviewsQuantityToShow =
    offset === 0 ? quantityFirstPage : quantityPerPage

  const productIdentifier = appSettings.uniqueId

  useDefaultSort(dispatch, appSettings, state.loadedConfigData)

  useEffect(() => {
    if (!linkText && !productId && !productReference) {
      return
    }

    client
      .query({
        query: queryRatingSummary,
        variables: {
          sort: selected,
          offset,
          pageId: JSON.stringify({
            linkText,
            productId,
            productReference,
          }),
          filter: parseInt(filter, 10) || 0,
          quantity: reviewsQuantityToShow,
        },
      })
      .then(response => {
        const rollup = response.data.productReviews.TotalResults
          ? response.data.productReviews.Includes.Products[0].ReviewStatistics
          : null

        const reviews = response.data.productReviews.Results
        const paging = {
          pageSize: response.data.productReviews.Limit,
          totalResults: response.data.productReviews.TotalResults,
        }

        const currentHistogram = rollup != null ? rollup.RatingDistribution : []
        const currentCount = rollup != null ? rollup.TotalReviewCount : 0
        const currentAverage = rollup != null ? rollup.AverageOverallRating : 0
        const currentSecondaryRatingsAverages =
          rollup != null ? rollup.SecondaryRatingsAverages : []

        const percentage = []

        currentHistogram.forEach(val => {
          percentage.push(`${((100 / currentCount) * val.Count).toFixed(2)}%`) // percentage calculation
        })
        percentage.reverse() // layout starts from 5, hence the .reverse()
        dispatch({
          type: 'SET_REVIEWS',
          reviews,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return <div />
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
      <AggregateStructuredData
        productName={product && product.productName}
        average={average}
        total={state.count}
      />
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
        productIdentifier={productIdentifier}
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
        <img src={state.selectedImage} alt="" />
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

export default withApollo(Reviews)
