"use client";

import { getAuthUserClient, verifySessionClient } from "@/features/auth/client";
import { useState, useEffect } from "react";

export default function useAuth() {
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
			} else {
				setState({
					isAuth: false,
					isLoading: false,
				});
			}
		});
	}, []);

	return state;
}
