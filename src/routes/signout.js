import config from '$config'
import { getCookieInfo, createExpiredCookie } from '$lib/cookies'
import fetch from 'node-fetch'

export async function get({ request }) {
  const userId = getCookieInfo(request.headers.get('cookie'))

  if (!userId) {
    return {
      status: 303,
      headers: {
        location: config.callbacks['signout.failed']
      }
    }
  }

  await deliverWebhooks()

  return {
    status: 303,
    headers: {
      'set-cookie': createExpiredCookie(),
      location: config.callbacks['signout.success']
    }
  }
}

async function deliverWebhooks() {
  const webhooks = config.webhooks['access.revoked'] || []

  const promises = webhooks.map(url => fetch(url, { method: 'POST' }))

  await Promise.all(promises)
}
