const { API_BASE: api_url } = process.env;

export async function getUsers(userID) {
	const url = `${api_url}/users` + (userID ? `/${userID}` : "");

	return await fetch(url).then((res) => res.json());
}

export async function verifyUser(key) {
	const url = `${api_url}/users/verify/${key}`;

	return await fetch(url).then((res) => res.json());
}

export async function resetUser(email) {
	const url = `${api_url}/users/reset/${email}`;

	return await fetch(url).then((res) => res.json());
}
