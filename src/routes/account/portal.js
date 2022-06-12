import config from '$config'
import db from '$lib/db'
import { getCookieInfo } from '$lib/cookies'
import Stripe from 'stripe'

const stripe = new Stripe(config.stripe.privateKey)

export async function get({ request }) {
  const { accountId, userId } = getCookieInfo(request.headers.get('cookie'))
  const member = await db.member.findFirst({
    where: { accountId, userId },
    include: {
      account: true
    }
  })

  if (!member.owner) {
    return {
      status: 401,
      message: "Unauthorized"
    }
  }

  // TODO revoke refresh token, because visting the portal can result in changes to the the plan's, subscription status or account status (ie closed)

  const session = await stripe.billingPortal.sessions.create({
    customer: member.account.stripeCustomerId,
    return_url: new URL('/integrations/stripe/portal/return', config.domain).toString()
  })

  return {
    status: 303,
    headers: {
      location: session.url
    }
  }
}
