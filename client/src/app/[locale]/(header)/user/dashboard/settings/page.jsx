import { getAuthUser } from "@/features/auth/dal";
import { getLang } from "@/lib/lang";
import Settings from "./form.client";

export default async function AccountSettings({ params }) {
	const { locale = "en" } = await params;
	const dict = await getLang(locale);
	const user = await getAuthUser();

	return (
		<article className="bg-white rounded-xl overflow-clip grid max-w-160 mx-auto drop-shadow-xl px-20 py-12">
			<header className="mb-8">
				<h1 className="text-2xl mb-4 font-extrabold font-display text-amber-500">
					Settings
				</h1>
			</header>
			<Settings {...user} dict={dict} />
		</article>
	);
}
