"use client";
import { useState, useActionState } from "react";
import { FaArrowRight } from "react-icons/fa6";

import AvatarPicker from "../../_components/AvatarPicker";
import { UpdateAccount, DeleteAccount } from "../../actions";

export function SignupForm({
	username,
	email,
	first_name,
	last_name,
	avatar,
	lang,
}) {
	const [preview, setPreview] = useState(avatar);
	const [avatarFile, setAvatarFile] = useState(null);

	const initState = {
		user: {
			username,
			email,
			first_name,
			last_name,
		},
	};
	const [state, submit, isPending] = useActionState(
		UpdateAccount.bind(null, avatarFile),
		initState
	);

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
		<form action={submit} className="grid grid-cols-6 gap-4 items-end">
			<AvatarPicker
				name="avatar"
				value={preview}
				submit={handleAvatar}
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
			<div className="col-span-full grid grid-cols-2 gap-4 *:transition-all *:duration-75">
				<button
					disabled={isPending}
					className="mt-8 py-3 px-5 cursor-pointer rounded-md bg-fuchsia-700 hover:bg-fuchsia-600 text-white font-semibold tracking-wider font-display"
				>
					Save changes
				</button>
				<button
					formAction={DeleteAccount}
					disabled={isPending}
					className="flex justify-center items-center mt-8 py-3 px-5 cursor-pointer rounded-md bg-slate-800 hover:bg-rose-700 text-white font-semibold tracking-wider font-display"
				>
					Delete account
				</button>
			</div>
		</form>
	);
}

function FormInput({ children, name, value, disabled, error, type, cols }) {
	const stateStyle = {
		valid: "outline-slate-200 hover:outline-slate-300",
		invalid: "outline-rose-300 hover:outline-rose-400",
	};

	const styles = `outline-1 rounded-xs py-1.5 px-2 focus:outline-slate-400 ${
		error ? stateStyle["invalid"] : stateStyle["valid"]
	}`;

	return (
		<label
			className={`grid gap-y-2 font-medium text-slate-800 ${
				cols ? cols : "col-span-full"
			}`}
			htmlFor={name}
		>
			{children}
			<input
				name={name}
				id={name}
				className={styles}
				type={type || "text"}
				defaultValue={value}
				disabled={disabled}
			/>
		</label>
	);
}
