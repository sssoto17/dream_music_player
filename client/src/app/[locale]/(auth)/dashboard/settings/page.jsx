import { SignupForm } from "../../create-account/[[...lang]]/form.client";
import { getAuthUser } from "@/features/auth/dal";
import { getUsers } from "@/features/db/users";
import { getLang } from "@/lib/lang";
import { getAvatarSrc } from "@/lib/utils";
import { cacheLife, cacheTag } from "next/cache";

export default async function AccountSettings({ params }) {
	"use cache";
	const { locale = "en" } = await params;
	const dict = await getLang(locale);

	cacheLife("hours");
	cacheTag("user");
	const user = await getUsers().then((users) => users[2]);

	const src = getAvatarSrc(user?.avatar);

	return (
		<main className="grid place-content-center place-items-center h-screen bg-linear-to-b from-amber-50 to-fuchsia-100">
			<section className="bg-white rounded-md overflow-clip grid mx-20 drop-shadow-xl max-w-content">
				<article className="px-16 py-12">
					<header className="mb-8">
						<h1 className="text-2xl mb-4 font-extrabold font-display text-amber-500">
							Settings
						</h1>
					</header>
					<SignupForm
						{...user}
						dict={dict}
						avatar={user?.avatar && src}
						isSignUp={false}
					/>
				</article>
			</section>
		</main>
	);
}
