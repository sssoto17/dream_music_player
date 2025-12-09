"use client";
import { useActionState } from "react";
import { FaArrowRight } from "react-icons/fa6";

import AvatarPicker from "@/components/form/AvatarPicker";
import Form, { FormInput } from "@/components/form/Form";
import { useUserSettings } from "@/features/auth/hooks";
import { redirect, useRouter, useSearchParams } from "next/navigation";

const { AUTH_BASE_URL: auth_url } = process.env;

export function SignupForm({ lang }) {
	const { SignUpAction, avatarPreview, updateAvatar, removeAvatar } =
		useUserSettings();
	const [state, submit, isPending] = useActionState(SignUpAction);
	// const [preview, setPreview] = useState(avatar);
	// const [avatarFile, setAvatarFile] = useState(null);

	// const update = UpdateAccount.bind(null, avatarFile, isSignUp);

	// function handleAvatar(e) {
	// 	const file = e.target.files[0];

	// 	setAvatarFile(file);
	// 	setPreview(URL.createObjectURL(file));
	// }

	// function removeAvatar() {
	// 	setAvatarFile(null);
	// 	setPreview(null);
	// }

	return (
		<Form action={submit}>
			<AvatarPicker
				name="avatar"
				value={avatarPreview}
				submit={updateAvatar}
				remove={removeAvatar}
			>
				{lang.avatar}
			</AvatarPicker>
			<FormInput
				name="username"
				value={state?.user?.username}
				error={state?.error?.username}
				disabled={isPending}
			>
				{lang.username}
			</FormInput>
			<FormInput
				name="first_name"
				value={state?.user?.first_name}
				error={state?.error?.name}
				disabled={isPending}
				cols="col-span-3"
			>
				{lang.first_name}
			</FormInput>
			<FormInput
				name="last_name"
				value={state?.user?.last_name}
				error={state?.error?.name}
				disabled={isPending}
				cols="col-span-3"
			>
				{lang.last_name}
			</FormInput>
			<FormInput
				name="email"
				value={state?.user?.email}
				error={state?.error?.email}
				disabled={isPending}
			>
				{lang.email}
			</FormInput>
			<FormInput
				name="password"
				value={state?.user?.password}
				error={state?.error?.password}
				disabled={isPending}
				type="password"
			>
				{lang.password}
			</FormInput>
			<FormInput
				name="confirm_password"
				error={state?.error?.password || state?.error?.passwordConfirm}
				disabled={isPending}
				type="password"
			>
				{lang.password_confirm}
			</FormInput>
			<SignUpButton disabled={isPending} />
			{/* {isSignUp ? (
			) : (
				<SettingsButtons action={DeleteAccount} disabled={isPending} />
			)} */}
		</Form>
	);
}

function SignUpButton({ disabled }) {
	return (
		<button
			disabled={disabled}
			className="col-span-full flex justify-center gap-8 items-center mt-8 py-3 px-5 cursor-pointer rounded-md bg-fuchsia-700 hover:bg-fuchsia-600 text-white font-semibold tracking-wider font-display"
		>
			<span>Continue</span> <FaArrowRight />
		</button>
	);
}
