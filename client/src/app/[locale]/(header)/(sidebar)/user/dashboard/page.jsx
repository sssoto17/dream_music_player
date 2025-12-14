import { getAvatarSrc } from "@/lib/utils";
import { getUsers } from "@/features/db/users";
import Browse from "@/components/browse/Browse";
import { UserItem } from "./client";
import { getAuthUser } from "@/features/auth/dal";
import { AdminLanguageButton } from "@/components/admin/Buttons";
import { getLang } from "@/lib/lang";

export default async function Dashboard({ params }) {
	const { locale = "en" } = await params;
	const users = await getUsers();
	const { user: authUser } = await getAuthUser();
	const dict = await getLang(locale);

	return (
		<>
			<section className="grid gap-y-4">
				<header className="py-4 border-b border-b-slate-300 flex gap-8 justify-between items-end">
					<h2 className="text-2xl font-display font-bold text-amber-900">
						{dict["dashboard"]}
					</h2>
					<AdminLanguageButton dict={dict}>
						{dict["lang_import"]}
					</AdminLanguageButton>
				</header>
				<Browse>{dict["search"]}</Browse>
				{authUser.role === "admin" && (
					<ul>
						{users.map((user) => {
							const src = getAvatarSrc(user.avatar);

							if (user.id === authUser.id) return null;
							return (
								<UserItem
									key={user.id}
									{...user}
									avatar={src}
									isAdmin={authUser?.role == "admin"}
									dict={dict}
								/>
							);
						})}
					</ul>
				)}
			</section>
		</>
	);
}
