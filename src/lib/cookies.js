export function getCookieInfo(cookieString) {
  const cookies = Object.fromEntries(cookieString.split(';').map(record => record.trim().split('=')))

  return cookies['idp']
}
