import axios from 'axios';
import { Apps } from '@vtex/api';

const _vtexProxy = (url:any) => {
  return url.replace(/\s+/g, "")
}

declare var process: {
    env: {
      VTEX_APP_ID: string
    }
}

export const queries = {
    productReviews: async (_:any, args:any, ctx:any) => {

        const { sort, page, pageId, filter } = args;

        const {appKey, uniqueId} =  await queries.getConfig(null, null, ctx);

        const product = JSON.parse(pageId);

        const fieldProductId = product[uniqueId];

        const endpoint = `http://api.bazaarvoice.com/data/reviews.json?apiversion=5.4&passkey=${appKey}&Filter=ProductId:eq:${fieldProductId}&Sort=${sort}&Limit=10&Offset=${page}&Include=Products&Stats=Reviews&Filter=${filter ? 'Rating:eq:' + filter : 'IsRatingsOnly:eq:false'}` 

        const requestOptions = {
            'headers': {
                'Proxy-Authorization': ctx.vtex.authToken,
                'X-Vtex-Proxy-To': endpoint,
                'X-Vtex-Use-Https': true,
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json'
            }
        }

        let reviews: any
        try {
            reviews = await axios.get(_vtexProxy(endpoint), requestOptions)
        } catch (error) {
            console.log("ERRO: ", error)
            throw new TypeError(error.response.data)
        }

        if(reviews.data.Includes.Products){
            reviews.data.Includes.Products = Object.keys(reviews.data.Includes.Products).map((k) => {
                return reviews.data.Includes.Products[k]
            })

            reviews.data.Includes.Products[0].ReviewStatistics.RatingDistribution = [1, 2, 3, 4, 5].map((i) => {
                let current_rating = reviews.data.Includes.Products[0].ReviewStatistics.RatingDistribution.find((rating:any) => {
                    return rating.RatingValue === i
                })
                return current_rating ? current_rating : {RatingValue: i, Count: 0}
            })
        }

        return reviews.data
    },
    getConfig: async (_:any, __:any, ctx:any) => {
        const apps = new Apps(ctx.vtex)
        const appId = process.env.VTEX_APP_ID
        const settings = await apps.getAppSettings(appId)
        return settings
    },

}

export const resolvers = {

    voteReview: async (_:any, args:any, ctx:any) => {

        const { reviewId, voteType } = args;

        const {merchantId} =  await queries.getConfig(null, null, ctx);

        const endpoint = `https://writeservices.powerreviews.com/voteugc`
        const requestOptions = {
            'headers': {
                'Proxy-Authorization': ctx.vtex.authToken,
                'X-Vtex-Proxy-To': endpoint,
                'X-Vtex-Use-Https': true
            },
            'data': {
                'merchant_id': merchantId,
                'ugc_id': reviewId,
                'vote_type': voteType
            }
        }

        let response: any
        try {
            response = await axios.post(_vtexProxy(endpoint), requestOptions)
        } catch (error) {
            throw new TypeError(error.response.data)
        }

        return response.data
    }
}
