import config from '$config'
import { getCookieInfo } from '$lib/cookies'
import Stripe from 'stripe'

const stripe = new Stripe(config.stripe.privateKey)

export async function get({ request, url }) {
  const product = url.searchParams.get('product')
  const period = url.searchParams.get('period')
  const email = getCookieInfo(request.headers.get('cookie'))

  const price = config.products[product]?.prices[period] 
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    success_url: new URL('/integrations/stripe/checkout/success?session_id={CHECKOUT_SESSION_ID}', config.domain).toString(),
    cancel_url: new URL('/integrations/stripe/checkout/cancel?session_id={CHECKOUT_SESSION_ID}', config.domain).toString(),
    line_items: [ { price, quantity: 1 } ],
    mode: 'subscription',
    metadata: {
      user_id: email
    }
  })

  return {
    status: 302,
    headers: {
      location: session.url
    },
  }
}
