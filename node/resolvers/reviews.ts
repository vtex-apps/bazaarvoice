import {ApolloError} from 'apollo-server'

declare var process: {
  env: {
    VTEX_APP_ID: string
  }
}

export const queries = {
  productReviews: async (_: any, args: any, ctx: Context) => {
    const { sort, page, pageId, filter } = args
    const { clients: { apps, reviews: reviewsClient }} = ctx

    const appId = process.env.VTEX_APP_ID
    const { appKey, uniqueId } = await apps.getAppSettings(appId)

    const product = JSON.parse(pageId)

    const fieldProductId = product[uniqueId]

    let reviews: any
    try {
      reviews = await reviewsClient.getReviews({appKey, fieldProductId, sort, page, filter})
    } catch (error) {
      throw new TypeError(error.response.data)
    }

    if (reviews.HasErrors) {
      throw new ApolloError(reviews.Errors[0].Message, reviews.Errors[0].Code)
    }

    if (reviews.data.Includes.Products) {
      reviews.data.Includes.Products = Object.keys(
        reviews.data.Includes.Products
      ).map(k => {
        return reviews.data.Includes.Products[k]
      })

      reviews.data.Includes.Products[0].ReviewStatistics.RatingDistribution = [
        1,
        2,
        3,
        4,
        5,
      ].map(i => {
        let current_rating = reviews.data.Includes.Products[0].ReviewStatistics.RatingDistribution.find(
          (rating: any) => {
            return rating.RatingValue === i
          }
        )
        return current_rating ? current_rating : { RatingValue: i, Count: 0 }
      })
    }

    return reviews.data
  },
  getConfig: async (_: any, __: any, ctx: Context) => {
    const { clients: { apps }} = ctx
    const appId = process.env.VTEX_APP_ID
    const settings = await apps.getAppSettings(appId)
    return settings
  },
}
