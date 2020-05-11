import { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import getConfig from './graphql/getConfig.gql'
import { graphql } from 'react-apollo'

const ReviewForm = props => {
  const { query, navigate } = useRuntime()
  const [loaded, setLoaded] = useState(false)
  const [productId, setProductId] = useState(null)

  useEffect(() => {
    if (!props.data.loading) {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.onload = function() {
        setProductId(query.product_id)
        setLoaded(true)
      }

      script.src = `https://display.ugc.bazaarvoice.com/static/${props.data.getConfig.clientName}/${props.data.getConfig.siteId}/en_US/bvapi.js`

      document.body.appendChild(script)
    }
  }, [props.data, query.product_id, query.return_page])

  useEffect(() => {
    if (!window.$BV || !productId) {
      return
    }

    window.$BV.configure('global', {
      events: {
        submissionClose: function() {
          if (query.return_page) {
            navigate({ to: query.return_page })
          }
        },
        submissionSubmitted: function() {
          if (query.return_page) {
            setInterval(() => navigate({ to: query.return_page }), 1000)
          }
        },
      },
    })

    window.$BV.ui('rr', 'submit_review', {
      productId: productId,
    })
  }, [loaded, navigate, query.return_page, productId])

  return null
}

const withGetConfig = graphql(getConfig, {
  options: () => ({
    ssr: false,
  }),
})

export default withGetConfig(ReviewForm)
