export function getCookieInfo(cookieString) {
  const cookies = Object.fromEntries(cookieString.split(';').map(record => record.trim().split('=')))
  const cookie = cookies['idp']
  const [userId, accountId] = cookie.split(',')

  return {
    userId: parseInt(userId),
    accountId: parseInt(accountId)
  }
}

export function createCookie(user, account) {
  // TODO use Secure in prod and encrypt
  return `idp=${user.id},${account?.id}; Domain=localhost; Path=/; SameSite=Lax; HttpOnly; Expires=Wed, 21 Oct 2023 07:28:00 GMT`
}

export function createExpiredCookie() {
  // TODO use Secure in prod and encrypt
  return `idp=; Domain=localhost; Path=/; SameSite=Lax; HttpOnly; Expires=Sat 1 Jan 2000 00:00:00 GMT`
}
