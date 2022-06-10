import config from '$config'

export async function get() {
  return {
    status: 303,
    headers: {
      'set-cookie': `idp=; Domain=localhost; Path=/; SameSite=Lax; HttpOnly; Expires=Wed, 21 Oct 2020 00:00:00 GMT`, // TODO use Secure in prod and encrypt
      location: config.callbacks['signup.canceled']
    }
  }
}
