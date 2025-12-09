export const verifySessionClient = async () => {
	let res = await fetch(`/auth/session/verify`, {
		method: "GET",
		credentials: "include",
	});

	if (res.status === 401) {
		res = await fetch("/auth/session/refresh", {
			method: "GET",
			credentials: "include",
		});

		if (res.status === 401) return { isAuth: false };
	}

	return await res.json();
};

export const getAuthUserClient = async () => {
	const res = await fetch("/auth/session/user", {
		method: "GET",
		credentials: "include",
	});

	if (!res.ok) return;

	return await res.json();
};

export const deleteSessionClient = async () => {
	const res = await fetch("/auth/session/signout", {
		method: "GET",
		credentials: "include",
	});

	if (!res.ok) return;

	return await res.json();
};
