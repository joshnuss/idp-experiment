import config from '$config'
import fetch from 'node-fetch'

export async function deliverWebhook(topic, message) {
  const webhooks = config.webhooks[topic] || []

  const promises = webhooks.map(url => post(url, message))

  await Promise.all(promises)
}

async function post(url, body) {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}
