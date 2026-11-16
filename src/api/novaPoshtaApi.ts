const NP_API = 'https://api.novaposhta.ua/v2.0/json/'

const npRequest = (modelName: string, calledMethod: string, methodProperties: object) =>
  fetch(NP_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: process.env.NEXT_PUBLIC_NP_API_KEY,
      modelName,
      calledMethod,
      methodProperties,
    }),
  }).then(r => r.json())

export interface NpCity {
  Ref: string
  Description: string
  AreaDescription: string
}

export interface NpWarehouse {
  Ref: string
  Description: string
  CategoryOfWarehouse: string
}

export const searchCities = async (query: string): Promise<NpCity[]> => {
  const res = await npRequest('Address', 'getCities', { FindByString: query, Limit: 10 })
  return res.data ?? []
}

export const getWarehouses = async (cityRef: string): Promise<NpWarehouse[]> => {
  const res = await npRequest('AddressGeneral', 'getWarehouses', { CityRef: cityRef, Limit: 300 })
  return res.data ?? []
}
