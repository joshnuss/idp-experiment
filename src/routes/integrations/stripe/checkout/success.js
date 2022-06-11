import config from '$config'
import { getCookieInfo } from '$lib/cookies'
import db from '$lib/db'
import { sign, generateRefreshToken } from '$lib/jwt'
import Stripe from 'stripe'

const stripe = new Stripe(config.stripe.privateKey)

export async function get({ request, url }) {
  const userId = getCookieInfo(request.headers.get('cookie'))
  const session_id = url.searchParams.get('session_id')

  const session = await stripe.checkout.sessions.retrieve(session_id)
  console.log(session)

  if (parseInt(session.metadata.userId) !== userId) {
    return {
      status: 400,
      body: "invalid request"
    }
  }

  const user = await db.user.findUnique({ where: { id: userId } })
  const subscription = await stripe.subscriptions.retrieve(session.subscription)

  console.log(subscription)

  let account, member

  await db.$transaction(async db => {
    account = await createAccount(db, {
      name: user.name,
      product: session.metadata.product,
      customer: session.customer,
      subscription: session.subscription,
      paymentStatus: subscription.status.toUpperCase()
    })

    member = await createOwner(db, account.id, user.id)
  })

  // TODO generate refresh token
  const accessToken = sign({account, user})
  const refreshToken = await generateRefreshToken({ id: member.id, userId: user.id, accountId: account.id })
  const redirectUrl = new URL(config.callbacks['signup.success'])

  redirectUrl.searchParams.set('accessToken', accessToken)
  redirectUrl.searchParams.set('refreshToken', refreshToken)

  return {
    status: 303,
    headers: {
      location: redirectUrl.toString()
    }
  }
}

async function createAccount(db, { name, product, customer, subscription, paymentStatus }) {
  return await db.account.create({
    data: {
      name,
      product,
      stripeCustomerId: customer,
      stripeSubscriptionId: subscription,
      paymentStatus
    }
  })
}

async function createOwner(db, accountId, userId) {
  return await db.member.create({
    data: { accountId, userId, owner: true }
  })
}
