"use client";

import { useActionState, useState, startTransition } from "react";
import { GrLanguage } from "react-icons/gr";
import { ImSpinner2 } from "react-icons/im";
import { ImportLanguages } from "@/features/actions/admin_actions";
import Toast from "../global/Toast";
import { FaUserAlt, FaUserAltSlash } from "react-icons/fa";
import { BlockUser } from "@/features/actions/admin_actions";

export function AdminLanguageButton({ dict, children }) {
	const [state, submit, isPending] = useActionState(ImportLanguages);
	const [toastActive, setToastActive] = useState(false);

	function handleLanguages() {
		startTransition(() => {
			submit();
		});

		setToastActive(true);
	}

	return (
		<>
			<button
				onClick={handleLanguages}
				disabled={isPending}
				className={`group bg-slate-700 hover:bg-slate-600 disabled:bg-slate-300 text-white max-w-48 w-full flex place-content-center items-center gap-2 rounded-full py-1 px-2 font-semibold font-display text-sm cursor-pointer transition-all duration-75 ease-in`}
			>
				<GrLanguage className="group-disabled:hidden" />
				<ImSpinner2 className="not-group-disabled:hidden animate-spin" />
				{children}
			</button>
			{!isPending && toastActive && (
				<Toast
					title={dict[state?.title]}
					error={Boolean(!state?.success)}
					close={setToastActive}
				>
					{dict[state?.message]}
				</Toast>
			)}
		</>
	);
}

export function AdminBlockButton({ action, isPending, is_blocked }) {
	return (
		<button
			disabled={isPending}
			onClick={action}
			aria-label="Block user"
			className="group/button relative disabled:opacity-50 disabled:animate-pulse z-10 not-disabled:not-group-hover:opacity-0 cursor-pointer hover:scale-105"
		>
			{isPending ? (
				<ImSpinner2 className="animate-spin" />
			) : is_blocked ? (
				<FaUserAlt size={14} className="peer" />
			) : (
				<FaUserAltSlash className="peer" />
			)}
			<ToolTip>{is_blocked ? "Unblock user" : "Block user"}</ToolTip>
		</button>
	);
}

function ToolTip({ children }) {
	return (
		<article className="text-sm transition-opacity duration-75 ease-in not-peer-hover:opacity-0 before:bg-white before:aspect-square before:absolute before:w-8 before:-translate-x-1/2 before:-translate-y-4 before:rotate-45 before:-z-10 absolute top-8 -translate-x-14 translate-y-2 bg-white w-32 py-2 px-6 drop-shadow-md rounded-md">
			<p>{children}</p>
		</article>
	);
}
