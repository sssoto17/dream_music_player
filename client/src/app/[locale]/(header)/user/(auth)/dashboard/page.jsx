import { getAvatarSrc } from "@/lib/utils";
import { getUsers } from "@/features/db/users";
import Browse from "@/components/browse/Browse";
import { UserItem } from "./client";
import { getAuthUser } from "@/features/auth/dal";

export default async function Dashboard({ params }) {
	const { locale = "en" } = await params;
	const users = await getUsers();

	const authUser = await getAuthUser();

	return (
		<>
			<Browse />
			<section className="col-start-2 col-span-full grid gap-y-2">
				<header className="py-4 border-b border-b-slate-300">
					<h2 className="text-4xl font-display font-bold text-amber-900">
						Users
					</h2>
				</header>
				<ul>
					{users.map((user) => {
						console.log(user);
						const src = getAvatarSrc(user.avatar);
						return (
							<UserItem
								key={user.id}
								{...user}
								avatar={src}
								isAdmin={authUser?.role == "admin"}
							/>
						);
					})}
				</ul>
			</section>
		</>
	);
}
