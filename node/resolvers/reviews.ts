import { ApolloError } from 'apollo-server'

declare var process: {
  env: {
    VTEX_APP_ID: string
  }
}

const DEFAULT_REVIEWS_QUANTITY = 10

/*This is a hack used to test the layout on some stores, but this should NEVER be used in
practice because this is an extremely bad design choice that does not scale. The stores
should configure bazaarvoice secondary ratings to have labels. */
const parseSecondaryRatingsData = (secondaryRatingsData: any) => {
  if (
    !secondaryRatingsData ||
    secondaryRatingsData.Label ||
    secondaryRatingsData.Label != null
  ) {
    return secondaryRatingsData
  }

  let newLabel = ''
  let currentChar
  for (let i = 0; i < secondaryRatingsData.Id.length; i++) {
    currentChar = secondaryRatingsData.Id.charAt(i)
    if (currentChar != currentChar.toLowerCase() && i != 0) {
      newLabel = newLabel + ' '
    }
    newLabel = newLabel + currentChar
  }

  return {
    ...secondaryRatingsData,
    Label: newLabel,
  }
}

const convertSecondaryRatings = (
  secondaryRatings: any,
  ratingOrder: Array<any>
) => {
  return ratingOrder.map(r => {
    return parseSecondaryRatingsData(secondaryRatings[r])
  })
}

export const queries = {
  productReviews: async (_: any, args: any, ctx: Context) => {
    const { sort, offset, pageId, filter, quantity } = args
    const {
      clients: { apps, reviews: reviewsClient },
    } = ctx

    const appId = process.env.VTEX_APP_ID
    const { appKey, uniqueId } = await apps.getAppSettings(appId)

    const product = JSON.parse(pageId)

    const fieldProductId = product[uniqueId]

    console.log({ uniqueId })

    let reviews: any
    const newQuantity = quantity || DEFAULT_REVIEWS_QUANTITY
    try {
      reviews = await reviewsClient.getReviews({
        appKey,
        fieldProductId,
        sort,
        offset,
        filter,
        quantity: newQuantity,
      })
    } catch (error) {
      throw new TypeError(error.response.data)
    }

    if (reviews.HasErrors) {
      throw new ApolloError(reviews.Errors[0].Message, reviews.Errors[0].Code)
    }

    if (reviews.Includes.Products) {
      reviews.Includes.Products = Object.keys(reviews.Includes.Products).map(
        k => {
          return reviews.Includes.Products[k]
        }
      )

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

      const ratingOrders =
        reviews.Includes.Products[0].ReviewStatistics
          .SecondaryRatingsAveragesOrder
      reviews.Includes.Products[0].ReviewStatistics.SecondaryRatingsAverages = ratingOrders.map(
        (r: string) => {
          return parseSecondaryRatingsData(
            reviews.Includes.Products[0].ReviewStatistics
              .SecondaryRatingsAverages[r]
          )
        }
      )

      if (reviews.Results[0].SecondaryRatings) {
        reviews.Results = reviews.Results.map((result: any) => {
          return {
            ...result,
            SecondaryRatings: convertSecondaryRatings(
              result.SecondaryRatings,
              ratingOrders
            ),
          }
        })
      }
    }

    return reviews
  },
  getConfig: async (_: any, __: any, ctx: Context) => {
    const {
      clients: { apps },
    } = ctx
    const appId = process.env.VTEX_APP_ID
    const settings = await apps.getAppSettings(appId)
    return settings
  },
}
