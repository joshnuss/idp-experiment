import config from '$config'
import { createClient } from '$lib/oauthClient'

export async function get({ params }) {
  const { domain } = config

  const oauthClient = createClient(params.provider, config)
  const authorizeUrl = oauthClient.authorizeUrl(domain, { action: 'signin' })

  return {
    status: 303,
    headers: {
      location: authorizeUrl
    }
  }
}
