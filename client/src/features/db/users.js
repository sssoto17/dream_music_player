import { cacheLife, cacheTag } from "next/cache";

const { API_BASE: api_url, AUTH_BASE: auth_url } = process.env;

export async function getUsers(id) {
	"use cache";
	cacheLife("minutes");
	cacheTag("users");

	const url = `${api_url}/users` + (id ? `/${id}` : "");

	return await fetch(url).then((res) => res.json());
}

export async function verifyUser(key) {
	const url = `${auth_url}/users/verify/${key}`;

	return await fetch(url).then((res) => res.json());
}

export async function resetUser(email) {
	const url = `${api_url}/users/reset/${email}`;

	return await fetch(url).then((res) => res.json());
}
