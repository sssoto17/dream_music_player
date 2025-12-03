import { Suspense } from "react";
import { redirect } from "next/navigation";
import { verifySession } from "@/features/auth/session";
import Link from "next/link";

export default function Page({ params, searchParams }) {
	return (
		<main className="grid place-content-center place-items-center h-screen bg-linear-to-b from-amber-50 to-fuchsia-100">
			<section className="bg-white rounded-md overflow-clip grid mx-20 drop-shadow-xl">
				<Suspense>
					<Content p={params} q={searchParams} />
				</Suspense>
			</section>
		</main>
	);
}

async function Content({ p, q }) {
	const { isAuth } = await verifySession();

	if (isAuth) redirect("/dashboard");

	const { lang } = await p;
	const { r } = await q;

	if (!r) redirect("/login"); // should redirect to error page

	return (
		<article className="px-16 py-12 grid content-start">
			<header>
				<h1 className="text-2xl mb-4 font-extrabold font-display text-amber-500">
					Reset your password
				</h1>
			</header>
			<form action="">
				<label
					className="grid gap-y-1 py-1.5 font-medium text-slate-800"
					htmlFor="password"
				>
					Enter new password
					<input
						className="outline-1 outline-slate-200 rounded-xs py-1 px-2 hover:outline-slate-300 focus:outline-slate-400"
						name="password"
						type="password"
					/>
				</label>
				<label
					className="grid gap-y-1 py-1.5 font-medium text-slate-800"
					htmlFor="confirm_password"
				>
					Confirm password
					<input
						className="outline-1 outline-slate-200 rounded-xs py-1 px-2 hover:outline-slate-300 focus:outline-slate-400"
						name="confirm_password"
						type="password"
					/>
				</label>

				<button className="mt-6 py-3 px-6 w-full cursor-pointer rounded-md bg-fuchsia-700 hover:bg-fuchsia-600 text-white text-base tracking-wider font-semibold font-display">
					Reset password
				</button>
			</form>
			<Link
				href="/login"
				className="inline-block my-2 text-slate-500 hover:underline hover:opacity-70 transition-all duration-75"
			>
				Have an account? Sign in now
			</Link>
		</article>
	);
}
