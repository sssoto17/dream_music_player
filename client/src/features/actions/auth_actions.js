"use server";
import { createSession, deleteCookie } from "@/features/auth/session";
import { resetUser } from "@/features/db/users";
import {
	updateAuthUser,
	deleteAuthUser,
	resetAuthUser,
} from "@/features/auth/dal";
import { validateData } from "@/features/db/schema";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { getLocalizedHref } from "@/lib/utils";

const {
	AUTH_BASE: auth_url,
	// API_BASE: api_url,
	// SERVER: server_url,
} = process.env;

export async function Login(locale, prev, formData) {
	const data = {
		email: formData.get("email"),
		password: formData.get("password"),
	};

	const res = await fetch(`${auth_url}/login`, {
		method: "POST",
		body: formData,
	});

	if (!res.ok) return { ...prev, user: data };

	const session = await res.json();

	if (session?.error) return { ...prev, user: data, error: session.error };

	const { isAuth } = await createSession(session);

	if (!isAuth) return { ...prev, user: data };

	updateTag("user");
	revalidatePath("/", "layout");
	redirect(getLocalizedHref(locale, "/"), "replace");
}

export async function Logout(locale) {
	await deleteCookie("refresh_token");
	await deleteCookie("access_token");
	await deleteCookie("user_id");

	updateTag("user");
	revalidatePath("/", "layout");

	redirect(getLocalizedHref(locale, "/"), "replace");
}

export async function SignUp(avatar, prev, formData) {
	const user = {
		username: formData.get("username"),
		email: formData.get("email"),
		first_name: formData.get("first_name"),
		last_name: formData.get("last_name"),
		password: formData.get("password"),
		passwordConfirm: formData.get("confirm_password"),
	};

	const error = validateData(formData);

	if (error) {
		return {
			user: user,
			error: error,
		};
	}

	formData.set("avatar", avatar);

	const res = await updateAuthUser(formData);

	if (res.error) {
		console.log(res.error);
		return {
			user: user,
			error: res.error,
		};
	}

	updateTag("user");
	revalidatePath("/", layout);
	redirect(`/user/${user?.username}`);
}

export async function UpdateAccount(avatar, prev, formData) {
	const user = {
		username: formData.get("username"),
		email: formData.get("email"),
		first_name: formData.get("first_name"),
		last_name: formData.get("last_name"),
		password: formData.get("password"),
		passwordConfirm: formData.get("confirm_password"),
	};

	if (!user.password) {
		formData.delete("password");
		formData.delete("confirm_password");
	}

	const error = validateData(formData);

	if (error) {
		return {
			user: user,
			error: error,
		};
	}

	if (!avatar) {
		formData.delete("avatar");
	} else {
		formData.set("avatar", avatar);
	}

	const res = await updateAuthUser(formData);

	if (res.error) {
		return {
			user: user,
			error: res.error,
		};
	}

	updateTag("user");
	revalidatePath("/", "layout");
	return {
		success: true,
		user: user,
	};
}

export async function ResetAccountRequest(prev, formData) {
	const response = await resetUser(formData.get("email"));

	if (response.status) {
		return {
			success:
				"Email with a link to reset your password has been sent to the email you provided.",
		};
	} else {
		return { error: "Something went wrong; please try again." };
	}
}

export async function ResetAccount(key, prev, formData) {
	const error = validateData(formData);

	if (error) {
		return {
			data: {
				password: formData.get("password"),
				passwordConfirm: formData.get("confirm_password"),
			},
			error: error,
		};
	}

	try {
		const res = await resetAuthUser(key, formData);

		if (res?.error) {
			return {
				error: res.error,
			};
		}
	} catch (e) {
		console.error(e);
	}

	// send a success message to the next page
	redirect("/login", "replace");
}

export async function DeleteAccount() {
	try {
		await deleteAuthUser();
	} catch (e) {
		console.error(e);
		// display toast with error message
	}

	// display a toast with a success message, followed by a redirect to home after a couple sec
	revalidatePath("/", "layout");
	redirect("/"); // redirect to successful deletion page which will automatically redirect to homepage after three seconds
}
