"use client";

import { getAuthUserClient, verifySessionClient } from "@/features/auth/client";
import { useState, useEffect } from "react";
import { SignUp } from "@/features/actions/auth_actions";

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

export function useUserSettings(props) {
	const [avatarPreview, setPreview] = useState(props?.avatar | null);
	const [avatarFile, setAvatarFile] = useState(null);

	const SignUpAction = SignUp.bind(null, avatarFile);

	function updateAvatar(e) {
		const file = e.target.files[0];

		setAvatarFile(file);
		setPreview(URL.createObjectURL(file));
	}

	function removeAvatar() {
		setAvatarFile(null);
		setPreview(null);
	}

	return { SignUpAction, avatarPreview, updateAvatar, removeAvatar };
}
