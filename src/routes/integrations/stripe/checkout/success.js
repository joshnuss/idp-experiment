import config from '$config'
import { getCookieInfo } from '$lib/cookies'
import Stripe from 'stripe'

const stripe = new Stripe(config.stripe.privateKey)

export async function get({ request, url }) {
  const email = getCookieInfo(request.headers.get('cookie'))
  const session_id = url.searchParams.get('session_id')

  const session = await stripe.checkout.sessions.retrieve(session_id)
  console.log(session)

  // TODO create account, member
  // TODO generate jwt
  //
  const redirectUrl = new URL(config.callbacks['signup.success'])

  redirectUrl.searchParams.set('accessToken', 'eyXYZ')
  redirectUrl.searchParams.set('refreshToken', 'eyXYZ')

  return {
    status: 303,
    headers: {
      location: redirectUrl.toString()
    }
  }
}
