import {ApolloError} from 'apollo-server'

declare var process: {
  env: {
    VTEX_APP_ID: string
  }
}

const convertSecondaryRatings = (secondaryRatings: any, ratingOrder: Array<any>) => {
  return ratingOrder.map( r => {
    return secondaryRatings[r]
  })
}

export const queries = {
  productReviews: async (_: any, args: any, ctx: Context) => {
    const { sort, offset, pageId, filter } = args
    const { clients: { apps, reviews: reviewsClient }} = ctx

    const appId = process.env.VTEX_APP_ID
    const { appKey, uniqueId } = await apps.getAppSettings(appId)

    const product = JSON.parse(pageId)

    const fieldProductId = product[uniqueId]

    let reviews: any
    try {
      reviews = await reviewsClient.getReviews({appKey, fieldProductId, sort, offset, filter})
    } catch (error) {
      throw new TypeError(error.response.data)
    }

    if (reviews.HasErrors) {
      throw new ApolloError(reviews.Errors[0].Message, reviews.Errors[0].Code)
    }

    if (reviews.Includes.Products) {
      reviews.Includes.Products = Object.keys(
        reviews.Includes.Products
      ).map(k => {
        return reviews.Includes.Products[k]
      })

      reviews.Includes.Products[0].ReviewStatistics.RatingDistribution = [
        1,
        2,
        3,
        4,
        5,
      ].map(i => {
        let current_rating = reviews.Includes.Products[0].ReviewStatistics.RatingDistribution.find(
          (rating: any) => {
            return rating.RatingValue === i
          }
        )
        return current_rating ? current_rating : { RatingValue: i, Count: 0 }
      })
      
      if (reviews.Results[0].SecondaryRatings) {
        const ratingOrders = reviews.Results[0].SecondaryRatingsOrder
        reviews.Results = reviews.Results.map( (result:any) => {
          return {
            ...result,
            SecondaryRatings: convertSecondaryRatings(result.SecondaryRatings, ratingOrders)
          }
        })
      }
    }

    return reviews
  },
  getConfig: async (_: any, __: any, ctx: Context) => {
    const { clients: { apps }} = ctx
    const appId = process.env.VTEX_APP_ID
    const settings = await apps.getAppSettings(appId)
    return settings
  },
}
