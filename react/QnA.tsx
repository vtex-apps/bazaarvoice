import React, { useContext, useEffect, useState } from 'react'
import { ProductContext } from 'vtex.product-context'

import styles from './styles.css'

const QnA = ({ appSettings }: { appSettings: Settings }) => {
  const [loaded, setLoaded] = useState(false)
  const { product } = useContext(ProductContext)
  const { productId } = product

  useEffect(() => {
    const script = document.createElement('script')

    script.type = 'text/javascript'
    // eslint-disable-next-line func-names
    script.onload = function () {
      setLoaded(true)
    }

    script.src = `https://display.ugc.bazaarvoice.com/static/${
      appSettings.clientName
    }/${appSettings.siteId}/${
      appSettings.locale ? appSettings.locale : 'en_US'
    }/bvapi.js`

    document.body.appendChild(script)
  }, [appSettings.clientName, appSettings.siteId, appSettings.locale])

  useEffect(() => {
    if (!window.$BV || !productId) {
      return
    }

    window.$BV.ui('qa', 'show_questions', {
      subjectType: 'product',
      productId,
    })
  }, [loaded, productId])

  return (
    <div className={`${styles.QnAContainer} mv4`}>
      <div id="BVQAContainer" />
    </div>
  )
}

export default QnA
