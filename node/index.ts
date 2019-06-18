import { queries as productReviews } from './resolvers/reviews'

export default new Service({
  graphql: {
    resolvers: {
      Query: {
        ...productReviews,
      },
    },
  },
})
