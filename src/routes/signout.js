import config from '$config'
import { getCookieInfo, createExpiredCookie } from '$lib/cookies'
import { revokeTokens } from '$lib/jwt'

export async function get({ request }) {
  const { userId, accountId } = getCookieInfo(request.headers.get('cookie'))

  if (!userId) {
    return {
      status: 303,
      headers: {
        location: config.callbacks['signout.failed']
      }
    }
  }

  await revokeTokens({ userId, accountId })

  return {
    status: 303,
    headers: {
      'set-cookie': createExpiredCookie(),
      location: config.callbacks['signout.success']
    }
  }
}
