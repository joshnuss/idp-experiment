export function getCookieInfo(cookieString) {
  const cookies = Object.fromEntries(cookieString.split(';').map(record => record.trim().split('=')))

  return parseInt(cookies['idp'])
}

export function createCookie(user) {
  // TODO use Secure in prod and encrypt
  return `idp=${user.id}; Domain=localhost; Path=/; SameSite=Lax; HttpOnly; Expires=Wed, 21 Oct 2023 07:28:00 GMT`
}

export function createExpiredCookie() {
  // TODO use Secure in prod and encrypt
  return `idp=; Domain=localhost; Path=/; SameSite=Lax; HttpOnly; Expires=Sat 1 Jan 2000 00:00:00 GMT`
}
