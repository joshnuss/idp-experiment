// oauthClient.js
import fetch from 'node-fetch'

// some provider data is copied from github.com/simov/grant
const providers = {
  bogus: {
    authorize_url: "http://localhost:8282/auth/request/path",
    access_url: "http://localhost:8282/access/token/request",
    userinfo_url: "http://localhost:8282/oauth2/v3/tokeninfo"
  },

  google: {
    authorize_url: "https://accounts.google.com/o/oauth2/v2/auth",
    access_url: "https://oauth2.googleapis.com/token"
  },

  github: {
    authorize_url: "https://github.com/login/oauth/authorize",
    access_url: "https://github.com/login/oauth/access_token",
  },
}

export default class OAuthClient {
  constructor(config) {
    this.config = config
    this.provider = providers[config.provider]

    if (!this.provider) throw new Error(`Unknown OAuth provider ${config.provider}`)
  }

  // generate a url to the OAuth2 provider's intake
  authorizeUrl(domain, state = {}) {
    const { client_id } = this.config
    const url = new URL(this.provider.authorize_url)
    const params = url.searchParams
    const redirectUrl = new URL(`${domain}/integrations/oauth2/callback`)

    params.set('response_type', 'code')
    params.set('client_id', client_id)
    params.set('redirect_uri', redirectUrl)
    params.set('state', btoa(JSON.stringify({provider: this.config.provider, ...state})))

    return url.toString()
  }

  // once the OAuth provider redirects the user back with a `code` param
  // use this function to get the access token
  async fetchAccessToken(code) {
    const { client_id, client_secret } = this.config

    const response = await fetch(this.provider.access_url, {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id,
        client_secret
      })
    })

    return {
      success: response.ok,
      payload: await response.json()
    }
  }

  async fetchUserInfo(id_token) {
    const url = new URL(this.provider.userinfo_url)
    url.searchParams.set('id_token', id_token)

    const response = await fetch(url.toString())

    return {
      success: response.ok,
      payload: await response.json()
    }
  }
}

export function createClient(provider, config) {
  const providerConfig = config.providers[provider]

  return new OAuthClient({ provider, ...providerConfig })
}
