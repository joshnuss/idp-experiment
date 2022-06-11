import config from '$config'
import { getCookieInfo } from '$lib/cookies'
import db from '$lib/db'
import Stripe from 'stripe'

const stripe = new Stripe(config.stripe.privateKey)

export async function get({ request, url }) {
  const userId = getCookieInfo(request.headers.get('cookie'))
  const session_id = url.searchParams.get('session_id')

  const session = await stripe.checkout.sessions.retrieve(session_id)
  const { customer, subscription } = session
  const { product } = session.metadata
  console.log(session)

  if (parseInt(session.metadata.userId) !== userId) {
    return {
      status: 400,
      body: "invalid request"
    }
  }

  const user = await db.user.findUnique({ where: { id: userId } })

  // TODO create account, member
  await db.$transaction(async db => {
    const account = await createAccount(db, {
      name: user.name,
      product,
      customer,
      subscription
    })

    await createOwner(db, account.id, user.id)
  })

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

async function createAccount(db, { name, product, customer, subscription }) {
  return await db.account.create({
    data: {
      name,
      product,
      stripeCustomerId: customer,
      stripeSubscriptionId: subscription
    }
  })
}

async function createOwner(db, accountId, userId) {
  return await db.member.create({
    data: { accountId, userId, owner: true }
  })
}
