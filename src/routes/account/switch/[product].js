import config from '$config'
import db from '$lib/db'
import { getCookieInfo } from '$lib/cookies'
import Stripe from 'stripe'

const stripe = new Stripe(config.stripe.privateKey)

export async function get({ url, request, params }) {
  const { product } = params
  const period = url.searchParams.get('period') || 'monthly'
  const price = config.products[product]?.prices[period]

  const { accountId, userId } = getCookieInfo(request.headers.get('cookie'))
  const account = await db.account.findUnique({ where: { id: accountId } })
  const member = await db.member.findFirst({ where: { accountId, userId } })

  if (!member.owner) {
    return {
      status: 401,
      body: "Unauthorized"
    }
  }

  let subscription = await stripe.subscriptions.retrieve(account.stripeSubscriptionId)
  const itemId = subscription.items.data[0].id

  subscription = await stripe.subscriptions.update(account.stripeSubscriptionId, {
    items: [
      { id: itemId, price }
    ]
  })

  await db.account.update({
    where: { id: accountId },
    data: {
      product,
      paymentStatus: subscription.status.toUpperCase()
    }
  })

  return {
    status: 303,
    headers: {
      location: config.callbacks['account.updated']
    }
  }
}
