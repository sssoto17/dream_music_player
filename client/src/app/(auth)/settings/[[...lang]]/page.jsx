import { Suspense } from "react";
import { SignupForm } from "../../create-account/[[...lang]]/form.client";
import { getAuthUser } from "@/features/auth/dal";
import { getLang } from "@/lib/lang";

export default function AccountSettings({ params }) {
	return (
		<main className="grid place-content-center place-items-center h-screen bg-linear-to-b from-amber-50 to-fuchsia-100">
			<section className="bg-white rounded-md overflow-clip grid mx-20 drop-shadow-xl max-w-content">
				<Suspense>
					<UserSettings p={params} />
				</Suspense>
			</section>
		</main>
	);
}

async function UserSettings({ p }) {
	const user = await getAuthUser();
	const language = await getLang(p);

	return (
		<article className="px-16 py-12">
			<header className="mb-8">
				<h1 className="text-2xl mb-4 font-extrabold font-display text-amber-500">
					Settings
				</h1>
			</header>
			<SignupForm
				{...user}
				lang={language}
				avatar={user.avatar && `${process.env.SERVER}/${user.avatar}`}
			/>
		</article>
	);
}
