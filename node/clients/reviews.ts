import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'
import { BazaarVoiceReviews } from '../typings/reviews'

interface GetReviewArgs {
  appKey: string
  fieldProductId: string
  sort: string
  offset: string
  filter: string
  quantity: number
}

export default class Reviews extends ExternalClient {
  public constructor(context: IOContext, options?: InstanceOptions) {
    super('http://api.bazaarvoice.com', context, options)
  }

  public async getReviews({
    appKey,
    fieldProductId,
    sort,
    offset,
    filter,
    quantity,
  }: GetReviewArgs): Promise<BazaarVoiceReviews> {
    const endpoint = `/data/reviews.json?apiversion=5.4&passkey=${appKey}&Filter=ProductId:eq:${fieldProductId}&Sort=${sort}&Limit=${quantity}&Offset=${offset}&Include=Products&Stats=Reviews&Filter=${
      filter ? 'Rating:eq:' + filter : 'IsRatingsOnly:eq:false'
    }`

    return this.http.get(endpoint, {
      metric: 'bazaarvoice-get-reviews',
    })
  }
}
