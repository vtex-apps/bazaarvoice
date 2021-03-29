import { GraphQLError } from '../graphql/GraphQLError'
import {
  BazaarVoiceReviews,
  SecondaryRating,
  BazaarVoiceReviewsGraphQL,
  ProductGraphQL,
  SecondaryRatingsAverage,
  SecondaryRatingsAverageGraphQL,
} from '../typings/reviews'

declare let process: {
  env: {
    VTEX_APP_ID: string
  }
}

const DEFAULT_REVIEWS_QUANTITY = 10

/* This is a hack used to test the layout on some stores, but this should NEVER be used in
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
    if (currentChar !== currentChar.toLowerCase() && i !== 0) {
      newLabel += ' '
    }

    newLabel += currentChar
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
  return ratingOrder.map((r) => {
    return parseSecondaryRatingsData(secondaryRatings[r])
  })
}

const getBindingSettings = (appSettings: any, currentBindingId?: string) => {
  if (!appSettings || !currentBindingId) {
    return appSettings
  }

  const { bindingBounded, settings = [] } = appSettings

  if (!bindingBounded) {
    return appSettings
  }

  const found = settings.find(
    ({ bindingId }: any) => bindingId === currentBindingId
  )

  if (!found) {
    return {}
  }

  const { bindingId, ...bindingSettings } = found

  return bindingSettings
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
      vtex: { binding },
    } = ctx

    const appId = process.env.VTEX_APP_ID

    return apps.getAppSettings(appId).then(async (appSettings: any) => {
      const bindingId = binding?.id
      const settings = getBindingSettings(appSettings, bindingId)
      const { appKey, uniqueId, locale } = settings

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
          contentLocale: locale,
        })
      } catch (error) {
        throw new TypeError(error.response.data)
      }

      if (reviews.HasErrors && reviews.Errors) {
        throw new GraphQLError(
          reviews.Errors[0].Message,
          parseInt(reviews.Errors[0].Code, 10)
        )
      }

      // Creating Local Rating Distribution
      let batchReviews: BazaarVoiceReviews
      const allReviews: any = []
      let newOffset: number = offset

      while (newOffset < reviews.TotalResults) {
        try {
          // eslint-disable-next-line no-await-in-loop
          batchReviews = await reviewsClient.getReviews({
            appKey,
            fieldProductId,
            sort,
            offset: newOffset.toString(),
            filter,
            quantity: 100,
            contentLocale: locale,
          })
        } catch (error) {
          throw new TypeError(error.response.data)
        }

        if (batchReviews.HasErrors && batchReviews.Errors) {
          throw new GraphQLError(
            batchReviews.Errors[0].Message,
            parseInt(batchReviews.Errors[0].Code, 10)
          )
        }

        batchReviews.Results.forEach((review) => {
          allReviews.push(review.Rating)
        })

        newOffset += 100
      }

      let products: ProductGraphQL[] = []

      if (reviews.Includes.Products) {
        products = Object.keys(reviews.Includes.Products).map((productName) => {
          const currentProduct = reviews.Includes.Products[productName]
          const ratingOrders =
            currentProduct.ReviewStatistics.SecondaryRatingsAveragesOrder

          const LocalRatingDistribution: any =
            currentProduct.ReviewStatistics.LocalRatingDistribution || []

          const countRating = (rating: number) => {
            return allReviews.filter((item: any) => item === rating).length
          }

          if (!LocalRatingDistribution.length) {
            ;[1, 2, 3, 4, 5].forEach((i) => {
              return LocalRatingDistribution.push({
                RatingValue: i,
                Count: countRating(i),
              })
            })
          }

          let localSum = 0

          LocalRatingDistribution.forEach((distribution: any) => {
            localSum += distribution.RatingValue * distribution.Count
          })

          const AverageLocalRating: number = localSum / reviews.TotalResults

          const productExtended: ProductGraphQL = {
            ...currentProduct,
            ReviewStatistics: {
              ...currentProduct.ReviewStatistics,
              RatingDistribution: [1, 2, 3, 4, 5].map((i) => {
                const currentRating = currentProduct.ReviewStatistics.RatingDistribution.find(
                  (rating) => rating.RatingValue === i
                )

                return currentRating ?? { RatingValue: i, Count: 0 }
              }),
              LocalRatingDistribution,
              AverageLocalRating,
              SecondaryRatingsAverages: ratingOrders.map((rating) => {
                return parseSecondaryRatingsData(
                  currentProduct.ReviewStatistics.SecondaryRatingsAverages[
                    rating
                  ]
                ) as SecondaryRatingsAverageGraphQL
              }),
            },
          }

          return productExtended
        })
      }

      return {
        ...reviews,
        Includes: {
          ...reviews.Includes,
          Products: products,
        },
        Results: reviews.Results.map((result) => {
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
    })
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
