import config from '$config'
import db from '$lib/db'
import { revokeTokens } from '$lib/jwt'
import Stripe from 'stripe'

const stripe = new Stripe(config.stripe.privateKey)

const endpointSecret = config.stripe.webhookSecret

export async function post({ request }) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret)
  } catch (err) {
    console.warn('⚠️  Webhook signature verification failed.', err.message)

    return { status: 400 }
  }

  const { object } = event.data


  switch(event.type) {
    case 'customer.updated':
      await updateCustomer(object)
      break

    case 'customer.subscription.updated':
      await updateSubscription(object)
      break

    case 'customer.subscription.deleted':
      await updateSubscription(object)
      break
  }

  return {}
}

async function updateCustomer(customer) {
  console.log(`✅ Customer updated ${customer.id}`)
}

async function updateSubscription(subscription) {
  const newPrice = subscription.items.data[0].price.id
  const product = findProduct(newPrice)
  const account = await db.account.findFirst({
    where: {
      stripeSubscriptionId: subscription.id
    }
  })

  if (account) {
    await revokeTokens({ accountId: account.id })

    await db.account.update({
      where: { id: account.id },
      data: {
        product,
        paymentStatus: subscription.status.toUpperCase(),
        cancelAt: subscription.cancel_at,
        canceledAt: subscription.canceled_at,
        closedAt: subscription.ended_at,
      }
    })
  }

  console.log(`✅ Subscription updated ${subscription.id}`)
}

function findProduct(newPrice) {
  for (let [product, {prices}] of Object.entries(config.products)) {
    for (let price of Object.values(prices)) {
      if (newPrice == price) {
        return product
      }
    }
  }
}
