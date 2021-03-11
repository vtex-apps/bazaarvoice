import React, { FC } from 'react'

interface Props {
  productName: string
  productId: string
  productUrl: string
  average: number
  total: number
}

const AggregateStructuredData: FC<Props> = ({
  productName,
  productId,
  productUrl,
  average,
  total,
}) => {
  if (!total || total === 0 || !average) {
    return null
  }

  const aggregate = {
    '@context': 'http://schema.org',
    '@type': 'Product',
    '@id': productUrl,
    mpn: productId,
    name: productName,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: typeof average === 'number' ? average.toFixed(2) : average,
      reviewCount: total,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregate) }}
    />
  )
}

export default AggregateStructuredData
