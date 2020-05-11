import { handleEvents } from '../BazaarvoicePixel'
import { getSettings } from '../modules/settings'
import { OrderPlacedData } from '../typings/events'

jest.mock('../modules/settings', () => ({
  getSettings: jest.fn(),
}))

const mockedGetSettings = getSettings as jest.Mock<{ uniqueId: string }>

window.BV = {
  pixel: {
    trackTransaction: jest.fn(),
  },
} as any

const productId = '123'
const productReference = 'R123'
const productSlug = 'white-t-shirt'

const orderPlacedEvent: OrderPlacedData = {
  accountName: 'storecomponents',
  event: 'orderPlaced',
  eventName: 'vtex:orderPlaced',
  currency: 'USD',
  salesChannel: '1',
  orderGroup: '123',
  coupon: '',
  visitorType: '',
  transactionSubtotal: 100,
  transactionTax: 0,
  transactionShipping: 10,
  transactionId: 'T123',
  transactionDate: '2020-03-05',
  transactionAffiliation: 'Store',
  transactionTotal: 90,
  transactionCurrency: 'USD',
  transactionPaymentType: [
    {
      group: '3',
      paymentSystemName: 'Visa',
      installments: 1,
      value: 90,
    },
  ],
  transactionShippingMethod: [
    {
      itemId: '123',
      selectedSla: 'Standard',
    },
  ],
  transactionPayment: { id: 'T3123' },
  visitorAddressPostalCode: '21212',
  visitorAddressCountry: 'USA',
  visitorAddressState: 'Broadway',
  visitorContactInfo: ['john@email.com', 'John', 'Doe'],
  transactionDiscounts: 0,
  transactionProducts: [
    {
      id: productId,
      sku: '321',
      productRefId: productReference,
      slug: productSlug,
      originalPrice: 100,
      price: 90,
      sellingPrice: 90,
      tax: 0,
      quantity: 1,
      name: 'White T-shirt',
      category: 'Clothing',
      brand: 'Nike',
      brandId: '90',
      skuRefId: 'WT123',
      skuName: 'White T-shirt',
      ean: '123123123',
      seller: 'Store',
      sellerId: '1',
      categoryId: '30',
      categoryTree: [],
      categoryIdTree: ['30'],
      components: [],
      measurementUnit: 'un',
      unitMultiplier: 1,
    },
  ],
}

beforeEach(() => {
  ;(window.BV.pixel.trackTransaction as jest.Mock).mockClear()
})

test('Order Placed event with uniqueId as productId', () => {
  mockedGetSettings.mockImplementation(() => ({ uniqueId: 'productId' }))
  const message = new MessageEvent('message', {
    data: orderPlacedEvent,
  })

  handleEvents(message)

  const calledWith = (window.BV.pixel.trackTransaction as jest.Mock).mock
    .calls[0][0]

  expect(calledWith.items[0].productId).toBe(productId)
})

test('Order Placed event with uniqueId as linkText', () => {
  mockedGetSettings.mockImplementation(() => ({ uniqueId: 'linkText' }))
  const message = new MessageEvent('message', {
    data: orderPlacedEvent,
  })

  handleEvents(message)

  const calledWith = (window.BV.pixel.trackTransaction as jest.Mock).mock
    .calls[0][0]

  expect(calledWith.items[0].productId).toBe(productSlug)
})

test('Order Placed event with uniqueId as productReference ', () => {
  mockedGetSettings.mockImplementation(() => ({
    uniqueId: 'productReference',
  }))
  const message = new MessageEvent('message', {
    data: orderPlacedEvent,
  })

  handleEvents(message)

  const calledWith = (window.BV.pixel.trackTransaction as jest.Mock).mock
    .calls[0][0]

  expect(calledWith.items[0].productId).toBe(productReference)
})
