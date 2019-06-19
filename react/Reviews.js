import React, { Component } from 'react'
import queryRatingSummary from './graphql/queries/queryRatingSummary.gql'
import withGetConfig from './components/withGetConfig'
import { withApollo } from 'react-apollo'
import { Pagination, Dropdown, Modal } from 'vtex.styleguide'
import withProductContext from './components/withProductContext'

import styles from './styles.css'

let hasUpdated = false

class Reviews extends Component {
  constructor(props) {
    super(props)

    this.state = {
      reviews: [],
      average: 0,
      histogram: [],
      count: 0,
      percentage: [],
      options: [
        {
          label: 'Most Recent',
          value: 'SubmissionTime:asc',
        },
        {
          label: 'Most Relevant',
          value: 'Helpfulness:desc,SubmissionTime:asc',
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
      ],
      selected: 'SubmissionTime:asc',
      filter: '0',
      filters: [
        {
          label: 'Select a filter...',
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
      ],
      paging: {},
      detailsIsOpen: false,
      isModalOpen: false,
      selectedImage: null,
    }
  }

  calculatePercentage = () => {
    let { histogram, count } = this.state

    let arr = []

    histogram.forEach((val, i) => {
      arr.push(((100 / count) * val.Count).toFixed(2) + '%') // cálculo de porcentagem
    })

    arr.reverse()

    this.setState({ percentage: arr })
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  componentDidUpdate() {
    if (!hasUpdated) {
      if (!this.props.product && !this.props.data.loading) {
        this.getReviews(this.state.selected)
        hasUpdated = true
      }
    }
  }

  getReviews(orderBy, page, filter) {
    this.props.client
      .query({
        query: queryRatingSummary,
        variables: {
          sort: orderBy,
          page: page || 0,
          pageId: JSON.stringify({
            linkText: this.props.product.linkText,
            productId: this.props.product.productId,
            productReference: this.props.product.productReference,
          }),
          filter: parseInt(filter) || 0,
        },
      })
      .then(response => {
        if (!this.mounted) {
          return
        }

        let reviews = response.data.productReviews.Results // revisar se sempre vem 1 item nesse array
        /* eslint-disable @typescript-eslint/camelcase */
        let paging = {
          page_size: response.data.productReviews.Limit,
          total_results: response.data.productReviews.TotalResults,
          current_page_number: response.data.productReviews.Offset,
          pages_total: Math.round(
            response.data.productReviews.TotalResults /
              response.data.productReviews.Limit
          ),
        }

        let rollup = response.data.productReviews.TotalResults
          ? response.data.productReviews.Includes.Products[0].ReviewStatistics
          : null
        this.setState({
          reviews: reviews,
          average: rollup != null ? rollup.AverageOverallRating : 0,
          histogram: rollup != null ? rollup.RatingDistribution : [],
          count: rollup != null ? rollup.TotalReviewCount : 0,
          paging: paging,
        })

        this.calculatePercentage()
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log('ERROR: ', error)
      })
  }

  handleSort = (event, value) => {
    this.setState({ selected: value })
    this.getReviews(value)
  }

  handleFilter = (event, value) => {
    const currentSort = this.state.selected
    const currentPage = 0

    this.setState({ filter: value })
    this.getReviews(currentSort, currentPage, value)
  }

  handleClickNext = () => {
    this.goToPage(this.state.paging.current_page_number * 10)
  }

  handleClickPrevious = () => {
    this.goToPage((this.state.paging.current_page_number - 2) * 10)
  }

  getTimeAgo = time => {
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

  goToPage(page) {
    let orderBy = this.state.selected

    this.props.client
      .query({
        query: queryRatingSummary,
        variables: {
          sort: orderBy,
          page: page || 0,
          pageId: JSON.stringify({
            linkText: this.props.product.linkText,
            productId: this.props.product.productId,
            productReference: this.props.product.productReference,
          }),
        },
      })
      .then(response => {
        let reviews = response.data.productReviews.Results // revisar se sempre vem 1 item nesse array
        let paging = {
          page_size: response.data.productReviews.Limit,
          total_results: response.data.productReviews.TotalResults,
          current_page_number: response.data.productReviews.Offset,
          pages_total: Math.round(
            response.data.productReviews.TotalResults /
              response.data.productReviews.Limit
          ),
        }

        this.setState({
          reviews: reviews,
          paging: paging,
        })
      })
  }

  openModalImage = image => {
    this.setState({
      isModalOpen: true,
      selectedImage: image,
    })
  }

  handleModalToggle = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    })
  }

  render() {
    return this.state.reviews.length ? (
      <div className={`${styles.review} mw8 center`}>
        <h3 className={`${styles.reviewTitle} t-heading-3 bb b--muted-5 mb5`}>
          Reviews
        </h3>
        <div className="review__rating">
          <div className="review__rating--stars dib relative v-mid mr2">
            <div className="review__rating--inactive nowrap">
              {[0, 1, 2, 3, 4].map((_, i) => {
                return i <= 3 ? (
                  <svg
                    className="mr2"
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill={'#eee'}
                    viewBox="0 0 14.737 14"
                  >
                    <path
                      d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z"
                      transform="translate(0)"
                    />
                  </svg> // se o review.Rating for 4, preenche 4 estrelas
                ) : (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill={'#eee'}
                    viewBox="0 0 14.737 14"
                  >
                    <path
                      d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z"
                      transform="translate(0)"
                    />
                  </svg> // se o review.Rating for 4, preenche 4 estrelas
                )
              })}
            </div>
            <div
              className="review__rating--active nowrap overflow-hidden absolute top-0-s left-0-s"
              style={{ width: this.state.average * 20 + '%' }}
            >
              {[0, 1, 2, 3, 4].map((_, i) => {
                let { average } = this.state

                return i <= 3 ? (
                  <svg
                    className="mr2"
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill={average > i ? '#fc0' : '#eee'}
                    viewBox="0 0 14.737 14"
                  >
                    <path
                      d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z"
                      transform="translate(0)"
                    />
                  </svg> // se o review.Rating for 4, preenche 4 estrelas
                ) : (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill={average > i ? '#fc0' : '#eee'}
                    viewBox="0 0 14.737 14"
                  >
                    <path
                      d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z"
                      transform="translate(0)"
                    />
                  </svg> // se o review.Rating for 4, preenche 4 estrelas
                )
              })}
            </div>
          </div>
          <span className="review__rating--average dib v-mid c-muted-1">
            ({this.state.reviews.length})
          </span>
        </div>
        <div className="review__histogram">
          <ul className="bg-muted-5 pa7 list">
            {this.state.percentage.map((percentage, i) => {
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
              Reviewed by {this.state.count}{' '}
              {this.state.count == 1 ? 'customer' : 'customers'}
            </h4>
            <div className="mb7">
              <Dropdown
                options={this.state.options}
                onChange={this.handleSort}
                value={this.state.selected}
                {...this.props}
              />
            </div>
            <div className="mb7">
              <Dropdown
                options={this.state.filters}
                onChange={this.handleFilter}
                value={this.state.filter}
                {...this.props}
              />
            </div>

            <div className="mv5">
              <a
                href={`/new-review?product_id=${
                  this.props.product[this.props.data.getConfig.uniqueId]
                }&return_page=/${this.props.product.slug}/p`}
              >
                {' '}
                Write a review{' '}
              </a>
            </div>
          </div>

          {this.state.reviews.map((review, i) => {
            return (
              <div
                key={i}
                className="review__comment bw2 bb b--muted-5 mb5 pb4"
              >
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
                    <strong>Submitted</strong>{' '}
                    {this.getTimeAgo(review.SubmissionTime)}
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
                          onClick={() =>
                            this.openModalImage(item.Sizes.normal.Url)
                          }
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
            currentItemFrom={
              1 +
              (this.state.paging.current_page_number - 1) *
                this.state.paging.page_size
            }
            currentItemTo={
              this.state.paging.current_page_number *
              this.state.paging.page_size
            }
            textOf="of"
            totalItems={this.state.paging.total_results}
            onNextClick={this.handleClickNext}
            onPrevClick={this.handleClickPrevious}
          />
        </div>
        <Modal
          centered
          isOpen={this.state.isModalOpen}
          onClose={this.handleModalToggle}
        >
          <img src={this.state.selectedImage} />
        </Modal>
      </div>
    ) : (
      <div className={`${styles.review} mw8 center c-on-base`}>
        <h3 className={`${styles.reviewTitle} t-heading-3 b--muted-5 mb5`}>
          Reviews
        </h3>
        <div className="review__comments">
          <div className="review__comments_head">
            <h4 className="review__comments_title t-heading-4 bb b--muted-5 mb5 pb4">
              Reviewed by {this.state.count}{' '}
              {this.state.count == 1 ? 'customer' : 'customers'}
            </h4>
            <div className="mb7">
              <Dropdown
                options={this.state.options}
                onChange={this.handleSort}
                value={this.state.selected}
                {...this.props}
              />
            </div>
            <div className="mb7">
              <Dropdown
                options={this.state.filters}
                onChange={this.handleFilter}
                value={this.state.filter}
                {...this.props}
              />
            </div>

            {!this.props.data.loading && !this.props.product && (
              <div className="mv5">
                <a
                  href={`/new-review?product_id=${
                    this.props.product[this.props.data.getConfig.uniqueId]
                  }&return_page=/${this.props.product.slug}/p`}
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
}

export default withApollo(withGetConfig(withProductContext(Reviews)))
