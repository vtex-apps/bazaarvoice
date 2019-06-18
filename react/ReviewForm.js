import { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import getConfig from './graphql/getConfig.graphql'
import { graphql } from 'react-apollo'

const ReviewForm = props => {
  const {
    culture: { locale },
    query,
    navigate,
  } = useRuntime()
  const [loaded, setLoaded] = useState(false)
  const [productId, setProductId] = useState(null)
  const [, setReturnPage] = useState(null)

  useEffect(() => {
    if (!props.data.loading) {
      var script = document.createElement('script')
      script.onload = function() {
        setProductId(query.product_id)
        setReturnPage(query.return_page)
        setLoaded(true)
      }

      script.src = `https://display.ugc.bazaarvoice.com/static/${props.data.getConfig.clientName}/${props.data.getConfig.siteId}/en_US/bvapi.js`

      document.body.appendChild(script)
    }
  }, [
    props.data.getConfig.clientName,
    props.data.getConfig.siteId,
    props.data.loading,
    query.product_id,
    query.return_page,
  ])

  useEffect(() => {
    if (!window.$BV) {
      return
    }

    window.$BV.configure('global', {
      events: {
        submissionClose: function(data) {
          // eslint-disable-next-line no-console
          console.log('close')
          // navigate({ to: returnPage })
        },
        submissionSubmitted: function(data) {
          // eslint-disable-next-line no-console
          console.log('submitted')
          // setInterval(() => navigate({ to: returnPage }), 1000)
        },
      },
    })

    window.$BV.ui('rr', 'submit_review', {
      productId: productId,
    })
  }, [loaded, productId])

  return null
}

const withGetConfig = graphql(getConfig, {
  options: () => ({
    ssr: false,
  }),
})

export default withGetConfig(ReviewForm)
