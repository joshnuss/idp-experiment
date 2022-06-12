import config from '$config'
import db from '$lib/db'
import { sign, generateRefreshToken } from '$lib/jwt'
import { getCookieInfo } from '$lib/cookies'

export async function get({ request }) {
  const { userId, accountId } = getCookieInfo(request.headers.get('cookie'))
  const member = await db.member.findFirst({
    where: { userId, accountId },
    include: {
      account: true,
      user: true
    }
  })
  const accessToken = sign(member)
  const refreshToken = await generateRefreshToken(member)
  const redirectUrl = new URL(config.callbacks['portal.return'])

  redirectUrl.searchParams.set('accessToken', accessToken)
  redirectUrl.searchParams.set('refreshToken', refreshToken)

  return {
    status: 303,
    headers: {
      location: redirectUrl.toString()
    }
  }
}
