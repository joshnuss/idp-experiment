import config from '$config'
import { getCookieInfo } from '$lib/cookies'
import db from '$lib/db'
import Stripe from 'stripe'

const stripe = new Stripe(config.stripe.privateKey)

export async function get({ request, url }) {
  const product = url.searchParams.get('product')
  const period = url.searchParams.get('period')
  const userId = getCookieInfo(request.headers.get('cookie'))
  const user = await db.user.findUnique({ where: { id: userId } })

  const price = config.products[product]?.prices[period] 
  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    success_url: new URL('/integrations/stripe/checkout/success?session_id={CHECKOUT_SESSION_ID}', config.domain).toString(),
    cancel_url: new URL('/integrations/stripe/checkout/cancel?session_id={CHECKOUT_SESSION_ID}', config.domain).toString(),
    line_items: [ { price, quantity: 1 } ],
    mode: 'subscription',
    metadata: {
      userId,
      product,
      period,
      price
    }
  })

  return {
    status: 302,
    headers: {
      location: session.url
    },
  }
}
