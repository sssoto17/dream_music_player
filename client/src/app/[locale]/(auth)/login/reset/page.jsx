import Link from "next/link";
import { PasswordReset } from "../form.client";
import { getLang } from "@/lib/lang";

export default async function Page({ params }) {
	const { locale } = await params;
	const lang = await getLang(locale);
	return (
		<article className="px-16 py-12 grid content-start">
			<header className="mb-8">
				<h1 className="text-2xl mb-4 font-extrabold font-display text-amber-500">
					{locale == "dk"
						? "Glemt din adgangskode?"
						: "Forgot your password?"}
				</h1>
				<p>
					{locale == "dk"
						? "Nulstil den nu!"
						: "No problem! Reset it below."}
				</p>
			</header>
			<PasswordReset dict={lang} />
			<Link
				href={`/${locale}/login`}
				className="inline-block my-2 text-slate-500 hover:underline hover:opacity-70 transition-all duration-75"
			>
				Have an account? Sign in now
			</Link>
		</article>
	);
}
