import React, { FunctionComponent } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'

import styles from '../styles.css'

const messages = defineMessages({
  mostRecent: {
    defaultMessage: '',
    id: 'store/bazaar-voice.sort-by.most-recent',
  },
  mostRelevant: {
    defaultMessage: '',
    id: 'store/bazaar-voice.sort-by.most-relevant',
  },
  ratingDesc: {
    defaultMessage: '',
    id: 'store/bazaar-voice.sort-by.rating-desc',
  },
  ratingAsc: {
    defaultMessage: '',
    id: 'store/bazaar-voice.sort-by.rating-asc',
  },
  mostHelpful: {
    defaultMessage: '',
    id: 'store/bazaar-voice.sort-by.most-helpful',
  },
  all: {
    defaultMessage: '',
    id: 'store/bazaar-voice.filter.all',
  },
  oneStar: {
    defaultMessage: '',
    id: 'store/bazaar-voice.filter.one-star',
  },
  twoStars: {
    defaultMessage: '',
    id: 'store/bazaar-voice.filter.two-stars',
  },
  threeStars: {
    defaultMessage: '',
    id: 'store/bazaar-voice.filter.three-stars',
  },
  fourStars: {
    defaultMessage: '',
    id: 'store/bazaar-voice.filter.four-stars',
  },
  fiveStars: {
    defaultMessage: '',
    id: 'store/bazaar-voice.filter.five-stars',
  },
})

const ReviewsDropdowns: FunctionComponent<ReviewsDropdownsProps> = ({
  handleSort,
  selected,
  props,
  handleFilter,
  filter,
}) => {
  const intl = useIntl()

  const options = [
    {
      label: intl.formatMessage(messages.mostRecent),
      value: 'SubmissionTime:desc',
    },
    {
      label: intl.formatMessage(messages.mostRelevant),
      value: 'Helpfulness:desc,SubmissionTime:desc',
    },
    {
      label: intl.formatMessage(messages.ratingDesc),
      value: 'Rating:desc',
    },
    {
      label: intl.formatMessage(messages.ratingAsc),
      value: 'Rating:asc',
    },
    {
      label: intl.formatMessage(messages.mostHelpful),
      value: 'Helpfulness:desc',
    },
  ]

  const filters = [
    {
      label: intl.formatMessage(messages.all),
      value: '0',
    },
    {
      label: intl.formatMessage(messages.oneStar),
      value: '1',
    },
    {
      label: intl.formatMessage(messages.twoStars),
      value: '2',
    },
    {
      label: intl.formatMessage(messages.threeStars),
      value: '3',
    },
    {
      label: intl.formatMessage(messages.fourStars),
      value: '4',
    },
    {
      label: intl.formatMessage(messages.fiveStars),
      value: '5',
    },
  ]

  return (
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
  )
}

interface ReviewsDropdownsProps {
  handleSort: any
  selected: string
  props: any
  handleFilter: any
  filter: string
}

export default ReviewsDropdowns
