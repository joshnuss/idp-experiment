import config from '$config'
import { createClient } from '$lib/oauthClient'
import db from '$lib/db'
import { sign, generateRefreshToken } from '$lib/jwt'
import { createCookie } from '$lib/cookies'

export async function get({ url }) {
  const code = url.searchParams.get('code')
  const { provider, action } = decodeJSON(url.searchParams.get('state'))
  const oauthClient = createClient(provider, config)
  const result = await oauthClient.fetchAccessToken(code)

  if (result.success) {
    const user_info = await oauthClient.fetchUserInfo(result.payload.id_token)
    const { name, email } = user_info.payload
    const { product, period } = decodeJSON(result.payload.state)
    const user = await db.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            account: true,
            user: true
          }
        }
      }
    })

    if (user && user.provider !== provider) {
      return {
        status: 401,
        message: 'unauthorized provider'
      }
    }

    if (action == 'signup') {
      await upsertUser({ email, name, provider })

      const redirectUrl = new URL(`/checkout?product=${product}&period=${period}`, config.domain)

      return {
        status: 302,
        headers: {
          'set-cookie': createCookie(user),
          location: redirectUrl.toString()
        }
      }
    } else if (action == 'signin') {
      const member = user.memberships[0]
      const accessToken = sign(member)
      const refreshToken = await generateRefreshToken(member)
      const redirectUrl = new URL(config.callbacks['signin.success'])

      redirectUrl.searchParams.set('accessToken', accessToken)
      redirectUrl.searchParams.set('refreshToken', refreshToken)

      // TODO: check if existing user with different provider.
      // if true, block login, must use the same provider

      return {
        status: 302,
        headers: {
          'set-cookie': createCookie(user, member.account),
          location: redirectUrl.toString()
        }
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

async function upsertUser({ email, name, provider }) {
  await db.user.upsert({
    where: {
      email
    },
    create: {
      name,
      email,
      provider
    },
    update: {
      name
    }
  })
}
