"server-only";
import { cookies } from "next/headers";

const { AUTH_BASE: auth_url, CLIENT: api } = process.env;

export const cookie_options = {
	maxAge: 3600, // expires cookie after one hour
	sameSite: "lax",
	path: "/",
};

export async function setCookie(name, value, options) {
	const store = await cookies();
	store.set(name, value, { ...cookie_options, ...options });
}

export async function deleteCookie(name) {
	const store = await cookies();
	store.set(name, "", { ...cookie_options, maxAge: 0 });
	store.delete(name);
}

export async function getCookie(name) {
	const store = await cookies();
	return store.get(name)?.value;
}

export async function createSession({ user_id, refresh_token, access_token }) {
	if (!refresh_token || !user_id || !access_token) return { isAuth: false };

	await setCookie("refresh_token", refresh_token, { maxAge: 21600 });
	await setCookie("access_token", access_token);
	await setCookie("user_id", user_id);

	return { isAuth: true, user_id: user_id };
}

export async function verifySession(access_token) {
	const res = await fetch(`${auth_url}/sessions/verify/${access_token}`);
	if (!res.ok) return { error: "Invalid json." };

	return await res.json();
}

export async function deleteSession() {
	return await fetch(`${api}/auth/session/signout`).then((res) => res.json());
}
