import { getCookie } from "./session";

const { CLIENT_URL: api } = process.env;

export const verifySessionServer = async () => {
	const access_token = await getCookie("access_token");

	if (!access_token) return { isAuth: false };

	let res = await fetch(`${api}/auth/session/verify`, {
		method: "GET",
		headers: {
			cookie: `access_token=${access_token}`,
		},
	});

	if (res.status === 401) {
		const refresh_token = await getCookie("refresh_token");

		if (!refresh_token) return { isAuth: false };

		res = await fetch(`${api}/auth/session/refresh`, {
			method: "GET",
			headers: {
				cookie: `refresh_token=${refresh_token}`,
			},
		});

		if (res.status === 401) return { isAuth: false };
	}

	return await res.json();
};
