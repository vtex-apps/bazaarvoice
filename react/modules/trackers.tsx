import { useEffect } from 'react'

const BV_PRODUCT = 'RatingsAndReviews'
const REVIEW = 'review'

export const useTrackImpression = (productId: string, contentId: string) => {
  useEffect(() => {
    if (window.BV?.pixel) {
      const impressionData = {
        contentId,
        productId,
        contentType: REVIEW,
        bvProduct: BV_PRODUCT,
      }

      window.BV?.pixel.trackImpression(impressionData)
    }
  }, [productId, contentId])
}

export const useTrackInView = (productId: string, containerId: string) => {
  useEffect(() => {
    if (!window.BV?.pixel) return
    const inViewData = {
      productId,
      bvProduct: BV_PRODUCT,
    }

    const trackInViewData = {
      containerId,
    }

    window.BV?.pixel.trackInView(inViewData, trackInViewData)
  }, [productId, containerId])
}

export const useTrackViewedCGC = (productId: string, containerId: string) => {
  useEffect(() => {
    if (!window.BV?.pixel) return
    const inViewData = {
      productId,
      bvProduct: BV_PRODUCT,
    }

    const trackInViewData = {
      containerId,
    }

    window.BV?.pixel.trackViewedCGC(inViewData, trackInViewData)
  }, [productId, containerId])
}

export const trackPageViewData = (
  productId: string,
  type: string,
  numReviews: number
) => {
  if (window.BV?.pixel) {
    const pageViewData = {
      bvProduct: BV_PRODUCT,
      productId,
      type,
      numReviews,
    }

    window.BV?.pixel.trackPageView(pageViewData)
  }
}
