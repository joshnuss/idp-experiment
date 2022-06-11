import config from '$config'
import db from '$lib/db'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { add } from 'date-fns'

export function sign({account, user}) {
  const data = {
    name: user.name,
    email: user.email,
    aid: account.id,
    uid: user.id,
    cus: account.stripeCustomerId,
    sub: account.stripeSubscriptionId,
    st: account.paymentStatus.toLowerCase()
  }

  return jwt.sign(data, config.keys.private, {
    issuer: 'idp',
    audience: account.product,
    expiresIn: '15m'
  })
}

export async function generateRefreshToken({accountId, userId, id: memberId}) {
  const token = nanoid(128)

  await revokeTokens(memberId)
  await createToken({ accountId, userId, memberId, token })

  return token
}

async function createToken({ accountId, userId, memberId, token }) {
  return await db.refreshToken.create({
    data: {
      account: { connect: { id: accountId } },
      user: { connect: { id: userId } },
      member: { connect: { id: memberId } },
      token,
      expiresAt: add(new Date(), { days: 7 })
    }
  })
}

async function revokeTokens(memberId) {
  return await db.refreshToken.updateMany({
    where: {
      memberId,
      revokedAt: null,
      expiresAt: {
        gt: new Date()
      }
    },
    data: { revokedAt: new Date() }
  })
}
