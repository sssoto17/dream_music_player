"use client";

import { useActionState } from "react";
import { Login, ResetAccountRequest } from "../actions";
import Form, { FormInput } from "@/components/form/Form";
import { useParams } from "next/navigation";

export function SignIn({ dict }) {
	const { locale } = useParams();
	const [state, submit, isPending] = useActionState(
		Login.bind(null, locale),
		{}
	);

	return (
		<Form>
			<FormInput
				name="email"
				type="email"
				value={state?.user?.email}
				disabled={isPending}
				error={state?.error}
			>
				{dict.email}
			</FormInput>
			<FormInput
				name="password"
				type="password"
				value={state?.user?.password}
				disabled={isPending}
				error={state?.error}
			>
				{dict.password}
			</FormInput>
			{state?.error && (
				<p className="col-span-full text-rose-600 font-semibold">
					{state?.error}
				</p>
			)}
			<button
				formAction={submit}
				className="mt-8 col-span-full py-3 px-6 w-full cursor-pointer rounded-md bg-fuchsia-700 hover:bg-fuchsia-600 text-white text-lg tracking-wider font-bold uppercase font-display"
			>
				Log In
			</button>
		</Form>
	);
}

export function PasswordReset({ dict }) {
	const [state, submit, isPending] = useActionState(ResetAccountRequest);

	return (
		<Form action={submit}>
			<FormInput
				name="email"
				type="email"
				disabled={isPending}
				error={state?.error?.email}
			>
				{dict.email}
			</FormInput>
			<button className="col-span-full mt-6 py-3 px-6 w-full cursor-pointer rounded-md bg-fuchsia-700 hover:bg-fuchsia-600 text-white text-base tracking-wider font-semibold font-display">
				Reset password
			</button>
		</Form>
	);
}
