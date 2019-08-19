import getConfig from '../graphql/getConfig.gql'
import { graphql } from 'react-apollo'

export interface Settings {
  uniqueId: string
  appKey: string
  clientName: string
  siteId: string
}

const withGetConfig = graphql<{}, Settings>(getConfig)

export default withGetConfig
