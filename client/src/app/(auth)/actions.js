"use server";
import { redirect } from "next/navigation";
import { createSession } from "@/features/auth/session";
import {
	authenticateUser,
	updateAuthUser,
	deleteAuthUser,
} from "@/features/auth/dal";
import { validateData } from "@/features/db/schema";
import { isEmpty } from "@/lib/utils";
import { getUsers } from "@/features/db/users";
import { revalidatePath } from "next/cache";

export async function LogIn(formData) {
	const user = await authenticateUser(formData);

	if (user?.error) return user.error;

	await createSession(user);

	redirect("/dashboard");
}

export async function SignUp(avatar, prev, formData) {
	const error = validateData(formData);

	if (!isEmpty(error)) {
		return {
			...prev,
			user: {
				username: formData.get("username"),
				email: formData.get("email"),
				first_name: formData.get("first_name"),
				last_name: formData.get("last_name"),
			},
			error,
		};
	}

	formData.set("avatar", avatar);

	try {
		await updateAuthUser(formData);
	} catch (e) {
		console.error(e);

		return {
			...prev,
			user: {
				username: formData.get("username"),
				email: formData.get("email"),
				first_name: formData.get("first_name"),
				last_name: formData.get("last_name"),
			},
			error: e,
		};
	}

	redirect("/dashboard");
}

// TRY TO CONSOLIDATE THE SIGNUP AND UPDATE ACTIONS AS THEY ARE SIMILAR
export async function UpdateAccount(avatar, { user }, formData) {
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

export async function ResetAccount(formData) {
	const user = await getUsers(formData.get("email"));
	console.log(user);
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
