import config from '$config'
import { createClient } from '$lib/oauthClient'

export async function get({ url }) {
  const code = url.searchParams.get('code')
  const { provider } = decodeJSON(url.searchParams.get('state'))
  const oauthClient = createClient(provider, config)
  const result = await oauthClient.fetchAccessToken(code)

  if (result.success) {
    const user_info = await oauthClient.fetchUserInfo(result.payload.id_token)
    const { product, period } = decodeJSON(result.payload.state)

    return {
      status: 302,
      headers: {
        'set-cookie': `idp=${user_info.payload.email}; Domain=localhost; Path=/; SameSite=Lax; HttpOnly; Expires=Wed, 21 Oct 2023 07:28:00 GMT`, // TODO use Secure in prod and encrypt
        location: `/checkout?product=${product}&period=${period}`
      }
    }
  } else {
    return {
      status: 401,
      body: 'unauthorized'
    }
  }
}

function decodeJSON(encodedString) {
  const decodedString = atob(encodedString)

  return JSON.parse(decodedString)
}
