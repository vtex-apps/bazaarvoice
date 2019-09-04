export const options = [
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

export const filters = [
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