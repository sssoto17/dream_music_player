import { getLocalizedHref } from "@/lib/utils";
import { getAuthUser } from "@/features/auth/dal";
import { getCookie } from "@/features/auth/session";

import Link from "next/link";
import { SignIn } from "./form.client";
import { getLang } from "@/lib/lang";
import AuthGuard from "../user/_components/AuthGuard";

const { AUTH_BASE_URL: auth_url } = process.env;

export default async function Home({ params }) {
	const { locale } = await params;
	const lang = await getLang(locale);

	const user = await getAuthUser();

	// console.log("hello", user);
	// const { exists } = await searchParams;

	// const userId = await getCookie("user_id");
	// const user = await getAuthUser(userId);

	// redirect to dashboard if user is signed in
	// if (user) redirect(getLocalizedHref(locale, `/user/${user.username}`));

	if (!user)
		return (
			<article className="px-16 py-12 grid grid-rows-[auto_1fr_auto] content-start">
				<header className="mb-8">
					<h1 className="text-3xl mb-4 font-extrabold font-display text-amber-500">
						Login
					</h1>
					{/* {exists && <p>User already registered. Sign in below.</p>} */}
				</header>
				<div>
					<SignIn dict={lang} />
					<Link
						href={getLocalizedHref(locale, "/login/reset")}
						className="inline-block my-2 text-slate-500 hover:underline hover:opacity-70 transition-all duration-75"
					>
						Forgot password?
					</Link>
				</div>
				<div className="grid justify-center my-12 group *:transition-all *:duration-75">
					<p className="text-center mb-2 text-slate-600 cursor-default group-hover:underline group-hover:opacity-70">
						Don&apos;t have an account?
					</p>
					<Link
						href={`${auth_url}/authorize`}
						className="text-center py-3 px-8 cursor-pointer rounded-md bg-slate-800 group-hover:bg-slate-700 text-white text-sm font-semibold uppercase font-display"
					>
						Register with Spotify
					</Link>
				</div>
			</article>
		);

	return (
		<main>
			<section>
				<h2>Auth page</h2>
			</section>
		</main>
	);
}
