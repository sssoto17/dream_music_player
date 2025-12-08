import Link from "next/link";
import { SignIn } from "./form.client";
import { getLang } from "@/lib/lang";
import { getLocalizedHref } from "@/lib/utils";

const { AUTH_BASE_URL: auth_url } = process.env;

export default async function Page({ params }) {
	const { locale } = await params;
	// const { exists } = await searchParams;

	const lang = await getLang(locale);

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
}
