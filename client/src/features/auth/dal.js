"server-only";
// import { verifySession } from "../auth/session";
import { redirect } from "next/navigation";
import { getCookie } from "./session";
// import { getLocalizedHref } from "@/lib/utils";
// import { verifySession } from "./session";
import { verifySessionClient } from "./client";
import { cacheLife, cacheTag } from "next/cache";
import { getAvatarSrc } from "@/lib/utils";
// import { cookies } from "next/headers";
// import { verifyUser } from "../db/users";
// import { cacheLife } from "next/cache";

const { AUTH_BASE: auth_url } = process.env;

const user_url = (id) => {
	return `${auth_url}/me/${id}`;
};

export async function verifyToken(access_token) {
	const res = await fetch(`${auth_url}/sessions/verify/${access_token}`);
	if (!res.ok) return { error: "Invalid json." };

	return await res.json();
}

export async function refreshToken(refresh_token) {
	const res = await fetch(`${auth_url}/sessions/refresh/${refresh_token}`);
	if (!res.ok) return { error: "Invalid json." };

	return await res.json();
}

export async function authenticateUser(credentials) {
	const res = await fetch(`${auth_url}/login`, {
		method: "POST",
		body: credentials,
	});

	if (!res.ok) return;

	return await res.json();
}

export async function getAuthUser(id) {
	"use cache";
	cacheTag("user");
	cacheLife("minutes");

	const res = await fetch(`${auth_url}/me/${id}`);

	if (!res.ok) return;

	const user = await res.json();

	const avatar = getAvatarSrc(user.avatar);

	user.avatar = avatar;

	return user;
}

export const verifySessionServer = async () => {
	const refreshToken = await getCookie("refresh_token");
	const accessToken = await getCookie("access_token");
	const userId = await getCookie("user_id");

	if (!refreshToken && !accessToken) {
		return { isAuth: false };
	}

	const res = await verifyToken(accessToken);

	if (!res?.error) return { isAuth: true, user_id: userId };

	// if (refreshToken) {
	// const res = await refreshAuth(refreshToken);

	// if (res?.error) return { isAuth: false };

	// return { isAuth: true, user_id: userId };
	// }

	return { isAuth: false };
};

export async function updateAuthUser(data) {
	const { isAuth, user_id } = await verifySessionClient();

	if (!isAuth) return redirect("/login");

	return await fetch(user_url(user_id), {
		method: "PATCH",
		body: data,
	}).then((res) => res.json());
}

export async function resetAuthUser(data, key) {
	if (!key) return { error: "Password reset has expired." };

	return await fetch(`${auth_url}/reset/${key}`, {
		method: "PATCH",
		body: data,
	}).then((res) => res.json());
}

export async function deleteAuthUser() {
	const { isAuth, user_id } = await verifySessionClient();

	if (!isAuth) return redirect("/login");

	return await fetch(user_url(user_id), { method: "DELETE" }).then((res) =>
		res.json()
	);
}
