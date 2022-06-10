import config from '$config'

export async function get({ url }) {
  const { defaultProduct, defaultPeriod, defaultProvider } = config
  const product = url.searchParams.get('product') || defaultProduct
  const period = url.searchParams.get('period') || defaultPeriod

  return {
    status: 303,
    headers: {
      location: `/signup/${defaultProvider}?product=${product}&period=${period}`
    }
  }
}
