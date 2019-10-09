import { useEffect } from 'react'

const BV_PRODUCT = 'RatingsAndReviews'
const REVIEW = 'review'

export const useTrackImpression = (productId:string, contentId: string) => {
  useEffect(() => {
    const impressionData = {
      contentId,
      productId,
      contentType: REVIEW,
      bvProduct: BV_PRODUCT
    }
    window.BV.pixel.trackImpression(impressionData)
  }, [productId, contentId])
}

export const useTrackInView = (productId: string, containerId: string) => {
  useEffect(() => {
    const inViewData = {
      productId,
      bvProduct: BV_PRODUCT
    }
    const trackInViewData = {
      containerId
    }
    window.BV.pixel.trackInView(inViewData, trackInViewData)
  }, [productId, containerId])
}

export const useTrackViewedCGC = (productId: string, containerId: string) => {
  useEffect(() => {
    const inViewData = {
      productId,
      bvProduct: BV_PRODUCT
    }
    const trackInViewData = {
      containerId
    }
    window.BV.pixel.trackViewedCGC(inViewData, trackInViewData)
  }, [productId, containerId])
}

export const trackPageViewData = (productId: string, type: string, numReviews: number) => {
    const pageViewData = {
      bvProduct: BV_PRODUCT,
      productId,
      type,
      numReviews
    }
    window.BV.pixel.trackPageView(pageViewData)
}