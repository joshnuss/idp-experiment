import config from '$config'
import db from '$lib/db'
import { sign, generateRefreshToken } from '$lib/jwt'
import { getCookieInfo } from '$lib/cookies'
import Stripe from 'stripe'

const stripe = new Stripe(config.stripe.privateKey)

export async function get({ url, request, params }) {
  const { product } = params
  const period = url.searchParams.get('period') || 'monthly'
  const price = config.products[product]?.prices[period]

  const { accountId, userId } = getCookieInfo(request.headers.get('cookie'))
  const account = await db.account.findUnique({ where: { id: accountId } })
  let member = await db.member.findFirst({ where: { accountId, userId } })

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

  member = await db.member.findUnique({ where: { id: member.id }, include: { user: true, account: true } })
  const accessToken = sign(member)
  const refreshToken = await generateRefreshToken(member)
  const redirectUrl = new URL(config.callbacks['account.updated'])

  redirectUrl.searchParams.set('accessToken', accessToken)
  redirectUrl.searchParams.set('refreshToken', refreshToken)

  return {
    status: 303,
    headers: {
      location: redirectUrl.toString()
    }
  }
}
