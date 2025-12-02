const { AUTH_BASE: auth_url } = process.env;

export async function getAccessToken(id) {
  const url = `${auth_url}/token/access/${id}`;

  return await fetch(url).then((res) => res.json());
}
