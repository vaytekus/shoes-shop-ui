import axios from 'axios'
const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL

export async function loginRequest(email: string, password: string): Promise<string> {
  const params = new URLSearchParams({
    grant_type: 'password',
    client_id: 'shoes-shop-client',
    username: email,
    password
  })

  const { data } = await axios.post(
    `${KEYCLOAK_URL}/protocol/openid-connect/token`,
    params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
  )

  return data.access_token
}