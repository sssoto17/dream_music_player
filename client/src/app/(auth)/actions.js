"use server";
import { redirect } from "next/navigation";

import { createSession, verifySession } from "@/features/auth/session";
import { authenticateUser, updateAuthUser } from "@/features/auth/dal";
import { validateData } from "@/lib/utils";

export async function LogIn(formData) {
	const user = await authenticateUser(formData);

	if (user?.error) return user.error;

	await createSession(user);

	redirect("/dashboard");
}

export async function SignUp(avatar, { user }, formData) {
	const { isAuth, userID } = await verifySession();

	if (!isAuth) redirect("/login");

	user.username = formData.get("username");
	user.email = formData.get("email");
	user.first_name = formData.get("first_name");
	user.last_name = formData.get("last_name");
	user.password = formData.get("password");
	user.passwordConfirm = formData.get("confirm_password");
	formData.set("avatar", avatar);

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
		await updateAuthUser(userID, formData);
	} catch (e) {
		console.error(e);
	}

	redirect("/dashboard");
}
