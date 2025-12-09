"use client";
import Form, { FormInput } from "@/components/form/Form";
import AvatarPicker from "@/components/form/AvatarPicker";
import { useActionState, useState } from "react";
import {
	UpdateAccountTest,
	DeleteAccount,
} from "@/features/actions/auth_actions";

export default function Settings({
	username,
	first_name,
	last_name,
	email,
	dict,
	avatar,
}) {
	const [preview, setPreview] = useState(avatar);
	const [avatarFile, setAvatarFile] = useState(null);
	const update = UpdateAccountTest.bind(null, avatarFile);
	const [state, submit, isPending] = useActionState(update, {
		user: {
			username: username,
			first_name: first_name,
			last_name: last_name,
			email: email,
		},
	});

	function handleAvatar(e) {
		const file = e.target.files[0];

		setAvatarFile(file);
		setPreview(URL.createObjectURL(file));
	}

	function removeAvatar() {
		setAvatarFile(null);
		setPreview(null);
	}

	return (
		<Form action={submit}>
			<AvatarPicker
				name="avatar"
				value={preview}
				submit={handleAvatar}
				remove={removeAvatar}
			>
				{dict.avatar}
			</AvatarPicker>
			<FormInput
				name="username"
				value={state?.user?.username}
				error={state?.error?.username}
				disabled={isPending}
			>
				{dict.username}
			</FormInput>
			<FormInput
				name="first_name"
				value={state?.user?.first_name}
				error={state?.error?.name}
				disabled={isPending}
				cols="col-span-3"
			>
				{dict.first_name}
			</FormInput>
			<FormInput
				name="last_name"
				value={state?.user?.last_name}
				error={state?.error?.name}
				disabled={isPending}
				cols="col-span-3"
			>
				{dict.last_name}
			</FormInput>
			<FormInput
				name="email"
				value={state?.user?.email}
				error={state?.error?.email}
				disabled={isPending}
			>
				{dict.email}
			</FormInput>
			<FormInput
				name="password"
				value={state?.user?.password}
				error={state?.error?.password}
				disabled={isPending}
				type="password"
			>
				{dict.password}
			</FormInput>
			<FormInput
				name="confirm_password"
				error={state?.error?.password || state?.error?.passwordConfirm}
				disabled={isPending}
				type="password"
			>
				{dict.password_confirm}
			</FormInput>

			<SettingsButtons action={DeleteAccount} disabled={isPending} />
		</Form>
	);
}

function SettingsButtons({ action, disabled }) {
	return (
		<div className="col-span-full grid grid-cols-2 gap-4 *:transition-all *:duration-75">
			<button
				disabled={disabled}
				className="mt-8 py-3 px-5 cursor-pointer rounded-md bg-fuchsia-700 hover:bg-fuchsia-600 text-white font-semibold tracking-wider font-display"
			>
				Save changes
			</button>
			<button
				formAction={action}
				disabled={disabled}
				className="flex justify-center items-center mt-8 py-3 px-5 cursor-pointer rounded-md bg-slate-800 hover:bg-rose-700 text-white font-semibold tracking-wider font-display"
			>
				Delete account
			</button>
		</div>
	);
}
