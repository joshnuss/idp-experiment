import config from '$config'
import { createClient } from '$lib/oauthClient'

export async function get({ params, url }) {
  const { defaultProduct, defaultPeriod, domain } = config
  const product = url.searchParams.get('product') || defaultProduct
  const period = url.searchParams.get('period') || defaultPeriod

  const oauthClient = createClient(params.provider, config)
  const authorizeUrl = oauthClient.authorizeUrl(domain, { product, period, action: 'signup' })

  return {
    status: 303,
    headers: {
      location: authorizeUrl
    }
  }
}
