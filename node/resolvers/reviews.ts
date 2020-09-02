import { ApolloError } from 'apollo-server'
import {
  BazaarVoiceReviews,
  SecondaryRating,
  BazaarVoiceReviewsGraphQL,
  ProductGraphQL,
  SecondaryRatingsAverage,
  SecondaryRatingsAverageGraphQL,
} from '../typings/reviews'

declare var process: {
  env: {
    VTEX_APP_ID: string
  }
}

const DEFAULT_REVIEWS_QUANTITY = 10

/*This is a hack used to test the layout on some stores, but this should NEVER be used in
practice because this is an extremely bad design choice that does not scale. The stores
should configure bazaarvoice secondary ratings to have labels. */
type Ratings = SecondaryRatingsAverageGraphQL | SecondaryRating
const parseSecondaryRatingsData = (
  secondaryRatingsData: SecondaryRatingsAverage | SecondaryRating
): Ratings => {
  if (
    !secondaryRatingsData ||
    (secondaryRatingsData as Ratings).Label ||
    (secondaryRatingsData as Ratings).Label != null
  ) {
    return secondaryRatingsData as Ratings
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
  secondaryRatings: Record<string, SecondaryRating>,
  ratingOrder: string[]
) => {
  return ratingOrder.map(r => {
    return parseSecondaryRatingsData(secondaryRatings[r])
  })
}

export const queries = {
  productReviews: async (
    _: any,
    args: any,
    ctx: Context
  ): Promise<BazaarVoiceReviewsGraphQL> => {
    const { sort, offset, pageId, filter, quantity } = args
    const {
      clients: { apps, reviews: reviewsClient },
    } = ctx

    const appId = process.env.VTEX_APP_ID
    const { appKey, uniqueId } = await apps.getAppSettings(appId)

    const product = JSON.parse(pageId)

    const fieldProductId = product[uniqueId]

    let reviews: BazaarVoiceReviews
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

    if (reviews.HasErrors && reviews.Errors) {
      throw new ApolloError(reviews.Errors[0].Message, reviews.Errors[0].Code)
    }

        let products: ProductGraphQL[] = []

    if (reviews.Includes.Products) {
      products = Object.keys(reviews.Includes.Products).map(productName => {
        const currentProduct = reviews.Includes.Products[productName]
        const ratingOrders =
          currentProduct.ReviewStatistics.SecondaryRatingsAveragesOrder

        const product: ProductGraphQL = {
          ...currentProduct,
          ReviewStatistics: {
            ...currentProduct.ReviewStatistics,
            RatingDistribution: [1, 2, 3, 4, 5].map(i => {
              const currentRating = currentProduct.ReviewStatistics.RatingDistribution.find(
                rating => rating.RatingValue === i
              )

              return currentRating
                ? currentRating
                : { RatingValue: i, Count: 0 }
            }),
            SecondaryRatingsAverages: ratingOrders.map(rating => {
              return parseSecondaryRatingsData(
                currentProduct.ReviewStatistics.SecondaryRatingsAverages[rating]
              ) as SecondaryRatingsAverageGraphQL
            }),
          },
        }

        return product
      })
    }

    return {
      ...reviews,
      Includes: {
        ...reviews.Includes,
          Products: products,
      },
      Results: reviews.Results.map(result => {
        const secondaryRatings = convertSecondaryRatings(
          result.SecondaryRatings as Record<string, SecondaryRating>,
          result.SecondaryRatingsOrder
        ) as SecondaryRating[]

        return {
          ...result,
          SecondaryRatings: secondaryRatings,
        }
      }),
    }
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
