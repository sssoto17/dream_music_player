"use server";
import { createSession } from "@/features/auth/session";
import { getUsers, resetUser } from "@/features/db/users";
import {
	authenticateUser,
	updateAuthUser,
	deleteAuthUser,
} from "@/features/auth/dal";
import { validateData } from "@/features/db/schema";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function LogIn(formData) {
	const user = await authenticateUser(formData);

	if (user?.error) return user.error;

	await createSession(user);

	redirect("/dashboard");
}

export async function UpdateAccount(avatar, isSignUp, prev, formData) {
	const user = {
		username: formData.get("username"),
		email: formData.get("email"),
		first_name: formData.get("first_name"),
		last_name: formData.get("last_name"),
		password: formData.get("password"),
		passwordConfirm: formData.get("confirm_password"),
	};

	if (!isSignUp && !user.password) {
		formData.delete("password");
		formData.delete("confirm_password");
	}

	const error = validateData(formData, isSignUp);

	if (error) {
		return {
			user: user,
			error: error,
		};
	}

	console.log(avatar);

	formData.set("avatar", avatar);

	try {
		const res = await updateAuthUser(formData);

		if (res?.error) {
			return {
				user: user,
				error: res.error,
			};
		}
	} catch (e) {
		console.error(e);

		return {
			user: user,
			error: e,
		};
	}

	// toast popup "changes saved!"
	console.log("changes saved!");
	if (isSignUp) {
		redirect("/dashboard");
	}
	return {
		user: user,
	};
}

// TRY TO CONSOLIDATE THE SIGNUP AND UPDATE ACTIONS AS THEY ARE SIMILAR
export async function UpdateAccountTest(avatar, { user }, formData) {
	user.username = formData.get("username");
	user.email = formData.get("email");
	user.first_name = formData.get("first_name");
	user.last_name = formData.get("last_name");
	user.password = formData.get("password");
	user.passwordConfirm = formData.get("confirm_password");
	formData.set("avatar", avatar);

	// EDIT: ensure that password validation only happens if the user doesn't already have a valid password
	const error = validateData(user);

	if (
		error?.username ||
		error?.email ||
		error?.name ||
		error?.password ||
		error?.passwordConfirm
	) {
		return {
			user: { ...user },
			error,
		};
	}

	try {
		await updateAuthUser(formData);
	} catch (e) {
		console.error(e);
	}

	revalidatePath("/");
	redirect("/dashboard");
}

export async function ResetAccountRequest(formData) {
	const response = await resetUser(formData.get("email"));

	if (response.status) {
		return {
			status: "Email with a link to reset your password has been sent to the email you provided.",
		};
	} else {
		return { status: "Something went wrong; please try again." };
	}
}

export async function ResetAccount(key, formData) {
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
		formData.append("r_key", key);

		// NOTE: this method deletes the user avatar! Create separate function
		const res = await updateAuthUser(formData, key);

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
	revalidatePath("/");
	redirect("/auth/signout"); // redirect to successful deletion page which will automatically redirect to homepage after three seconds
}
