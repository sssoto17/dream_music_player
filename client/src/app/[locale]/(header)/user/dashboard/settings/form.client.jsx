"use client";
import Form, { FormInput } from "@/components/form/Form";
import AvatarPicker from "@/components/form/AvatarPicker";
import { useActionState, useState } from "react";
import { DeleteAccount } from "@/features/actions/auth_actions";
import { useUserSettings } from "@/features/auth/hooks";

export default function Settings({
	username,
	first_name,
	last_name,
	email,
	avatar,
	dict,
}) {
	const { SubmitAction, avatarPreview, updateAvatar, removeAvatar } =
		useUserSettings(avatar, "update");

	const [state, submit, isPending] = useActionState(SubmitAction, {
		user: {
			username: username,
			first_name: first_name,
			last_name: last_name,
			email: email,
		},
	});
	const [displayToast, setDisplayToast] = useState(false);

	function handleSubmit(formData) {
		setDisplayToast(true);
		submit(formData);
	}

	return (
		<Form action={(e) => handleSubmit(e)}>
			<AvatarPicker
				name="avatar"
				value={avatarPreview}
				submit={updateAvatar}
				remove={removeAvatar}
			>
				{dict.avatar}
			</AvatarPicker>
			<FormInput
				name="username"
				value={state?.user?.username}
				error={state?.error?.username}
				disabled={isPending}
				withErrorLabel={state?.error?.username}
			>
				{dict.username}
			</FormInput>
			<FormInput
				name="first_name"
				value={state?.user?.first_name}
				error={state?.error?.name}
				disabled={isPending}
				cols="lg:col-span-3"
			>
				{dict.first_name}
			</FormInput>
			<FormInput
				name="last_name"
				value={state?.user?.last_name}
				error={state?.error?.name}
				disabled={isPending}
				cols="lg:col-span-3"
			>
				{dict.last_name}
			</FormInput>
			<FormInput
				name="email"
				value={state?.user?.email}
				error={state?.error?.email}
				disabled={isPending}
				withErrorLabel={state?.error?.email}
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
			{displayToast && <Toast setDisplayToast={setDisplayToast} />}
			{state?.error && <Toast />}
		</Form>
	);
}

function Toast({ setDisplayToast }) {
	return (
		<section className="fixed inset-0 grid place-content-center">
			<article className="bg-white min-w-80 rounded-xl drop-shadow-xl p-8 grid gap-y-4">
				<header className="pb-4 border-b border-b-slate-100">
					<h3 className="text-xl font-bold font-display text-amber-800">
						Update: success!
					</h3>
				</header>
				<p>Your changes have been saved.</p>
				<button
					onClick={() => setDisplayToast(false)}
					className="py-3 px-5 cursor-pointer rounded-md bg-fuchsia-700 hover:bg-fuchsia-600 text-white font-semibold tracking-wider font-display"
				>
					Ok
				</button>
			</article>
		</section>
	);
}

function SettingsButtons({ action, disabled }) {
	return (
		<div className="mt-8 col-span-full grid lg:grid-cols-2 gap-4 *:transition-all *:duration-75">
			<button
				disabled={disabled}
				className=" py-3 px-5 cursor-pointer rounded-md bg-fuchsia-700 hover:bg-fuchsia-600 text-white font-semibold tracking-wider font-display"
			>
				Save changes
			</button>
			<button
				formAction={action}
				disabled={disabled}
				className="flex justify-center items-center py-3 px-5 cursor-pointer rounded-md bg-slate-800 hover:bg-rose-700 text-white font-semibold tracking-wider font-display"
			>
				Delete account
			</button>
		</div>
	);
}
