import React, { useEffect, useState } from 'react';
import { useRuntime } from 'vtex.render-runtime';
import getConfig from './graphql/getConfig.graphql'
import { graphql } from 'react-apollo'


const ReviewForm = (props) => {
  const { culture: { locale }, query, navigate } = useRuntime()
  const [loaded, setLoaded] = useState(false)
  const [productId, setProductId] = useState(null)
  const [returnPage, setReturnPage] = useState(null)

  useEffect(() => {

    if (!props.data.loading) {

      var script = document.createElement('script')
      script.onload = function () {

        setProductId(query.product_id)
        setReturnPage(query.return_page)
        setLoaded(true)
      }

      script.src = `https://display.ugc.bazaarvoice.com/static/${props.data.getConfig.clientName}/${props.data.getConfig.siteId}/en_US/bvapi.js`

      document.body.appendChild(script);

    }

  }, [props.data.loading])


  useEffect(() => {

    if (!window.$BV) {
      console.log("$BV NO")
    } else {
      console.log("$BV SIM")

      $BV.configure('global', {
        events: {
          submissionClose: function (data) {
            console.log("close");
            // navigate({ to: returnPage })
          },
          submissionSubmitted: function (data) {
            console.log("submitted");
            // setInterval(() => navigate({ to: returnPage }), 1000)
          }
        }
      });

      $BV.ui('rr', 'submit_review', {
        productId: productId
      });

    }

  }, [loaded])

  return (
    <div></div>
  )
}

const withGetConfig = graphql(getConfig, {
  options: () => ({
    ssr: false,
  })
})

export default withGetConfig(ReviewForm)
