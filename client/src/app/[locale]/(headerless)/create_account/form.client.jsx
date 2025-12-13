"use client";
import { useActionState } from "react";
import { useUserSettings } from "@/features/auth/hooks";

import AvatarPicker from "@/components/form/AvatarPicker";
import Form, { FormInput } from "@/components/form/Form";
import { FaArrowRight } from "react-icons/fa6";

export function SignupForm({ lang }) {
	const { SubmitAction, avatarPreview, updateAvatar, removeAvatar } =
		useUserSettings();
	const [state, submit, isPending] = useActionState(SubmitAction);

	console.log(state);

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
				withErrorLabel={state?.error?.username}
			>
				{lang.username}
			</FormInput>
			<FormInput
				name="first_name"
				value={state?.user?.first_name}
				error={state?.error?.name}
				disabled={isPending}
				cols="lg:col-span-3"
			>
				{lang.first_name}
			</FormInput>
			<FormInput
				name="last_name"
				value={state?.user?.last_name}
				error={state?.error?.name}
				disabled={isPending}
				cols="lg:col-span-3"
			>
				{lang.last_name}
			</FormInput>
			<FormInput
				name="email"
				value={state?.user?.email}
				error={state?.error?.email}
				disabled={isPending}
				withErrorLabel={state?.error?.email}
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
