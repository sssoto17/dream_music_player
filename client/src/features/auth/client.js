export const verifySessionClient = async () => {
	let res = await fetch(`/api/session/verify`, {
		method: "GET",
		credentials: "include",
	});

	if (res.status === 401) {
		res = await fetch("/api/session/refresh", {
			method: "GET",
			credentials: "include",
		});

		if (res.status === 401) return { isAuth: false };
	}

	return await res.json();
};

export const getAuthUserClient = async () => {
	const res = await fetch("/api/session/user", {
		method: "GET",
		credentials: "include",
	});

	if (!res.ok) return;

	return await res.json();
};

export const deleteSessionClient = async () => {
	const res = await fetch("/api/session/signout", {
		method: "GET",
		credentials: "include",
	});

	if (!res.ok) return;

	return await res.json();
};
