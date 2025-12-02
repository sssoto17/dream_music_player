const { API_BASE: api_url } = process.env;

export async function getUsers(userID) {
  const url = `${api_url}/users` + (userID ? `/${userID}` : "");

  return await fetch(url).then((res) => res.json());
}
