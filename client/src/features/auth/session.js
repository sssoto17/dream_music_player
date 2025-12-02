import "server-only";
import { cookies } from "next/headers";
import { getAccessToken } from "../db/tokens";

export async function createSession({ id, username, access_token: token }) {
  const store = await cookies();
  const access_token = token || (await getAccessToken(id));

  if (!access_token || access_token?.error) return { isAuth: false };

  store.set("user_id", id);
  store.set("username", username);
  store.set("access_token", access_token);
  // perhaps set a time limit on it so it expires?
  // or handle expiration and refreshing purely in python?
  // if so, access_token needs to be checked with every API call to backend, so mismatch can trigger a refresh

  return { isAuth: true, userID: id, access_token: access_token };
}

export async function updateSession() {
  const store = await cookies();
  const refresh_token = store.get("refresh_token").value;

  if (!refresh_token) {
    return { error: "Unauthorized: Please sign in." };
  }

  const access_token = await fetch(`${auth_url}/access/token/${user.id}`).then(
    (res) => res.json()
  );

  // const { access_token, expire_in, error } = await refreshToken(refresh_token);

  // if (error) {
  //   store.delete("refresh_token");
  //   return { error: "Invalid token." };
  // }

  store.set("access_token", access_token);
}

export const verifySession = async () => {
  const store = await cookies();

  const id = store.get("user_id")?.value;
  const access_token = store.get("access_token")?.value;

  if (!id) return { isAuth: false };

  return { isAuth: true, userID: id, access_token: access_token };
};

export async function deleteSession() {
  const store = await cookies();
  store.delete("user_id");
  store.delete("username");
  store.delete("access_token");
}
