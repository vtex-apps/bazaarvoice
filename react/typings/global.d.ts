interface Window extends Window {
  BV: BazaarvoiceClient
}

interface BazaarvoiceClient {
  pixel: {
    trackTransaction: (transactionData: TransactionData) => void
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