import Link from "next/link";
import Form from "./form.client";

export default async function Page({ params }) {
	const { locale } = await params;
	console.log(locale);

	return (
		<main className="grid place-content-center place-items-center h-screen bg-linear-to-b from-amber-50 to-fuchsia-100">
			<section className="bg-white rounded-md overflow-clip grid mx-20 drop-shadow-xl">
				<article className="px-16 py-12 grid content-start">
					<header>
						<h1 className="text-2xl mb-4 font-extrabold font-display text-amber-500">
							Reset your password
						</h1>
					</header>
					<Form />
					<Link
						href="/login"
						className="inline-block my-2 text-slate-500 hover:underline hover:opacity-70 transition-all duration-75"
					>
						Have an account? Sign in now
					</Link>
				</article>
			</section>
		</main>
	);
}
