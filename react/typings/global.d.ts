interface Window extends Window {
  BV: BazaarvoiceClient
}

interface BazaarvoiceClient {
  pixel: {
    trackTransaction: (transactionData: TransactionData) => void
    trackImpression: (impressionData: ImpressionData) => void
    trackInView: (inViewData: InViewData, trackInViewData: TrackInViewData) => void
    trackViewedCGC: (inViewData: InViewData, trackViewedGCGData: TrackViewedGCGData) => void
    trackPageView: (pageViewData: PageViewData) => void
  }
}

interface TransactionData {
  orderId: string
  total: number
  currency: string
  country: string
  state: string
  items: BazaarvoiceItem[]
}

interface BazaarvoiceItem {
  sku: string
  quantity: number
  name: string
  price: number
  category: string
}

interface ImpressionData {
  contentId: string
  productId: string
  bvProduct: string
  contentType: string
}

interface TrackInViewData {
  containerId: string
}

interface InViewData {
  productId: string
  bvProduct: string
}

//Right now this is the same of TrackInViewData but 
//these two can receive different optional values.
interface TrackViewedGCGData {
  containerId: string
}