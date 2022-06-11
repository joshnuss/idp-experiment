import db from '$lib/db'
import { sign } from '$lib/jwt'

export async function post({ request }) {
  const { accountId, userId, refreshToken } = await request.json()
  const member = await db.member.findUnique({
    where: { accountId_userId: { accountId, userId } },
    include: {
      account: true,
      user: true
    }
  })

  if (!member) {
    return {
      status: 401,
      body: 'Unauthorized'
    }
  }

  const lastToken = await db.refreshToken.findFirst({
    where: {
      accountId,
      userId,
      revokedAt: null,
      expiresAt: {
        gt: new Date()
      }
    }
  })

  if (!lastToken || lastToken.token !== refreshToken) {
    return {
      status: 401,
      body: 'Unauthorized'
    }
  }

  return {
    status: 201,
    body: sign(member)
  }
}
