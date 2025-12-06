"use client";

import { useActionState } from "react";
import { ResetAccount } from "../../actions";
import Form, { FormInput } from "@/components/form/Form";
import { redirect, useSearchParams } from "next/navigation";

export default function Form() {
	const q = useSearchParams();
	const resetKey = q.get("r");

	if (!q.has("r")) redirect("/login"); //with error
	// if (!r) redirect("/login"); // should redirect to error page

	const submitReset = ResetAccount.bind(null, resetKey);
	const [state, submit, isPending] = useActionState(submitReset);

	return (
		<Form action={submit}>
			<FormInput
				name="password"
				type="password"
				value={state?.data?.password}
				error={state?.error?.password}
				disabled={isPending}
			>
				Enter new password
			</FormInput>
			<FormInput
				name="confirm_password"
				type="password"
				value={state?.data?.passwordConfirm}
				error={state?.error?.password}
				disabled={isPending}
			>
				Confirm password
			</FormInput>
			<button className="mt-6 py-3 px-6 w-full cursor-pointer rounded-md bg-fuchsia-700 hover:bg-fuchsia-600 text-white text-base tracking-wider font-semibold font-display">
				Reset password
			</button>
		</Form>
	);
}
