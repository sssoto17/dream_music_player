import { getUsers } from "@/features/db/users";
import { getLang } from "@/lib/lang";
import { getAvatarSrc } from "@/lib/utils";
import Settings from "./form.client";
import { getAuthUser } from "@/features/auth/dal";

export default async function AccountSettings({ params }) {
	const { locale = "en" } = await params;
	const dict = await getLang(locale);

	const user = await getAuthUser();

	console.log("auth", user);

	// const user = await getUsers().then((users) => users[2]);

	// const src = getAvatarSrc(user?.avatar);

	return (
		<article className="bg-white rounded-xl overflow-clip grid mx-20 drop-shadow-xl px-20 py-12">
			<header className="mb-8">
				<h1 className="text-2xl mb-4 font-extrabold font-display text-amber-500">
					Settings
				</h1>
			</header>
			<Settings {...user} dict={dict} />
			{/* <SignupForm
						{...user}
						dict={dict}
						avatar={user?.avatar && src}
						isSignUp={false}
					/> */}
		</article>
	);
}
