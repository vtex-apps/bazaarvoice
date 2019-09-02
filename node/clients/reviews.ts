import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

type GetReviewArgs = {
  appKey: string;
  fieldProductId: string;
  sort: string;
  offset: string;
  filter: string;
}

export default class Reviews extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('http://api.bazaarvoice.com', context, options)
  }

  public async getReviews ({ appKey, fieldProductId, sort, offset, filter }: GetReviewArgs): Promise<string> {
    const endpoint = `/data/reviews.json?apiversion=5.4&passkey=${appKey}&Filter=ProductId:eq:${fieldProductId}&Sort=${sort}&Limit=10&Offset=${offset}&Include=Products&Stats=Reviews&Filter=${
      filter ? 'Rating:eq:' + filter : 'IsRatingsOnly:eq:false'
    }`
    return this.http.get(endpoint, {
      metric: 'bazaarvoice-get-reviews',
    })
  }
}