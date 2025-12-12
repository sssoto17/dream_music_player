"use client";

import { getAuthUserClient, verifySessionClient } from "@/features/auth/client";
import { useState, useEffect } from "react";
import { SignUp, UpdateAccount } from "@/features/actions/auth_actions";

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

export function useUserSettings(avatar, method) {
	const [avatarPreview, setPreview] = useState(avatar || null);
	const [avatarFile, setAvatarFile] = useState(null);

	let SubmitAction;

	if (method == "update") {
		SubmitAction = UpdateAccount.bind(null, avatarFile);
	} else {
		SubmitAction = SignUp.bind(null, avatarFile);
	}

	function updateAvatar(e) {
		const file = e.target.files[0];

		setAvatarFile(file);
		setPreview(URL.createObjectURL(file));
	}

	function removeAvatar() {
		setAvatarFile(null);
		setPreview(null);
	}

	return {
		SubmitAction,
		avatarPreview,
		updateAvatar,
		removeAvatar,
	};
}
