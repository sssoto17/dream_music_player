"use client";

import { getAuthUserClient, verifySessionClient } from "@/features/auth/client";
import { useState, useEffect } from "react";
// import { verifySessionClient, getAuthUserClient } from "@/features/auth/client";

export function useAuth() {
	const [state, setState] = useState({ isLoading: true });

	useEffect(() => {
		verifySessionClient().then((res) => {
			if (res.isAuth) {
				getAuthUserClient().then((user) => {
					setState({
						isAuth: true,
						user: user,
						isLoading: false,
					});
				});
			}
		});
	}, []);

	return state;
}
