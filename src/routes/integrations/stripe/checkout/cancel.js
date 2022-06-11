import config from '$config'
import { createExpiredCookie } from '$lib/cookies'

export async function get() {
  return {
    status: 303,
    headers: {
      'set-cookie': createExpiredCookie(),
      location: config.callbacks['signup.canceled']
    }
  }
}
