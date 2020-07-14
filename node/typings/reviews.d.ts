export interface BazaarVoiceReviews {
  Limit: number
  Offset: number
  TotalResults: number
  Results: Result[]
  Includes: Include
  Locale: string

  HasErrors?: boolean
  Errors?: Error[]
}

interface BazaarVoiceReviewsGraphQL extends BazaarVoiceReviews {
  Includes: IncludeGraphQL
}

interface Error {
  Message: string
  Code: string
}

interface Include {
  Products: Record<string, Product>
  ProductsOrder: string[]
}

interface IncludeGraphQL {
  Products: ProductGraphQL[]
}

interface Product {
  ReviewStatistics: ReviewStatistics

  FamilyIds?: string[]
  Description?: string
  ManufacturerPartNumbers?: string[]
  UPCs?: string[]
  AttributesOrder?: string[]
  Attributes?: object
  ImageUrl?: string
  Name?: string
  Id?: string
  CategoryId?: string
  BrandExternalId?: string
  Brand?: object
  Active?: boolean
  ProductPageUrl?: string
  Disabled?: boolean
  ReviewIds?: []
  ModelNumbers?: []
  EANs?: []
  QuestionIds?: []
  ISBNs?: []
  StoryIds?: []
  TotalReviewCount?: number
}

interface ProductGraphQL extends Product {
  ReviewStatistics: ReviewStatisticsGraphQL
}

interface ReviewStatistics {
  TotalReviewCount: number
  AverageOverallRating: number
  NotRecommendedCount: number
  RatingDistribution: RatingDistribution[]
  SecondaryRatingsAveragesOrder: string[]
  SecondaryRatingsAverages: Record<string, SecondaryRatingsAverage>

  RecommendedCount?: number
  HelpfulVoteCount?: number
  NotHelpfulVoteCount?: number
  FeaturedReviewCount?: number
  RatingsOnlyReviewCount?: number
  FirstSubmissionTime?: string
  LastSubmissionTime?: string
  ContextDataDistribution?: object
  ContextDataDistributionOrder?: []
  OverallRatingRange?: number
  TagDistributionOrder?: []
  TagDistribution?: {}
}

interface ReviewStatisticsGraphQL extends ReviewStatistics {
  SecondaryRatingsAverages: SecondaryRatingsAverageGraphQL[]
}

interface RatingDistribution {
  RatingValue: number
  Count: number
}

interface Result {
  Id: string
  Rating: number
  TotalCommentCount: number
  IsRatingsOnly: boolean
  TotalFeedbackCount: number
  IsRecommended: boolean | null
  SecondaryRatingsOrder: string[]
  TotalNegativeFeedbackCount: number
  TotalPositiveFeedbackCount: number
  UserNickname: string | null
  UserLocation: string | null
  SubmissionTime: string
  Title: string
  ReviewText: string
  SecondaryRatings: Record<string, SecondaryRating> | SecondaryRating[]
  TagDimensions: object | TagDimensions
  Photos: Photo[]

  CID?: string
  SourceClient?: string
  LastModeratedTime?: string
  LastModificationTime?: string
  ProductId?: string
  CampaignId?: string
  UserLocation?: string
  AuthorId?: string
  ContentLocale?: string
  IsFeatured?: boolean
  TotalInappropriateFeedbackCount?: number
  TotalClientResponseCount?: number
  TotalCommentCount?: number
  Rating?: number
  Helpfulness?: number
  TotalFeedbackCount?: number
  TotalNegativeFeedbackCount?: number
  TotalPositiveFeedbackCount?: number
  ModerationStatus?: string
  SubmissionId?: string
  SubmissionTime?: string
  ReviewText?: string
  Title?: string
  UserNickname?: string
  Videos?: []
  ProductRecommendationIds?: []
  Pros?: null
  InappropriateFeedbackList?: []
  ContextDataValuesOrder?: []
  ContextDataValues?: {}
  AdditionalFieldsOrder?: []
  Badges?: {}
  ClientResponses?: []
  RatingRange?: number
  TagDimensionsOrder?: []
  IsSyndicated?: boolean
  BadgesOrder?: []
  CommentIds?: []
  AdditionalFields?: {}
  Cons?: null
}


interface SecondaryRatingsAverage {
  Id: string
  AverageRating: number
  MaxLabel: string | null
  DisplayType: string
  ValueRange: number
  MinLabel: string | null
}

interface SecondaryRatingsAverageGraphQL extends SecondaryRatingsAverage {
  Label: string
}

interface SecondaryRating {
  Value: number
  Id: string
  ValueRange: number
  ValueLabel: string | null
  MaxLabel: string | null
  MinLabel: string | null
  Label: string | null
  DisplayType: string
  MaxLabel: string
}

interface TagDimensions {
  Pros: Pros
  Cons: Cons
}

interface Pros {
  Values: string[]
  Id: string
  Label: string
}

interface Cons {
  Values: string[]
  Id: string
  Label: string
}

interface Photo {
  Sizes: ImageSize
}

interface ImageSize {
  normal: Image
  thumbnail: Image
}

interface Image {
  Url: string
}
