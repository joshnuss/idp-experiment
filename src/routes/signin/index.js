import config from '$config'

export async function get() {
  const { defaultProvider } = config

  return {
    status: 303,
    headers: {
      location: `/signin/${defaultProvider}`
    }
  }
}
