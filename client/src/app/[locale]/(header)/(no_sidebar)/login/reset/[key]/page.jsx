import Link from "next/link";
import { PasswordResetRequestForm, PasswordResetForm } from "../../form.client";
import { getLang } from "@/lib/lang";
import { getLocalizedHref } from "@/lib/utils";
import { checkResetKey } from "@/features/auth/dal";
import { redirect } from "next/navigation";

export default async function ResetPage({ params }) {
	const { locale, key } = await params;
	const lang = await getLang(locale);

	const { reset } = await checkResetKey(key);

	if (key && key !== reset) redirect("/login/reset");

	return (
		<article className="px-16 py-12 grid content-start">
			<header className="mb-8">
				<h1 className="text-2xl mb-4 font-extrabold font-display text-amber-500">
					{key
						? locale == "dk"
							? "Nulstil din adgangskode"
							: "Reset your password"
						: locale == "dk"
						? "Glemt din adgangskode?"
						: "Forgot your password?"}
				</h1>
				{!key && (
					<p>
						{locale == "dk"
							? "Nulstil den nu!"
							: "No problem! Reset it below."}
					</p>
				)}
			</header>
			<header>
				<h1 className="text-2xl mb-4 font-extrabold font-display text-amber-500"></h1>
			</header>
			{key ? (
				<PasswordResetForm dict={lang} />
			) : (
				<PasswordResetRequestForm dict={lang} />
			)}
			<Link
				href={getLocalizedHref(locale, "/")}
				className="inline-block my-2 text-slate-500 hover:underline hover:opacity-70 transition-all duration-75"
			>
				Have an account? Sign in now
			</Link>
		</article>
	);
}
