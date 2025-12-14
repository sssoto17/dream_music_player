import { getUsers } from "@/features/db/users";
import { Suspense } from "react";

export async function generateStaticParams() {
	const users = await getUsers();

	return users?.map((user) => ({
		user: user.username,
	}));
}

export default function SidebarLayout({ sidebar, children }) {
	return (
		<div className="content-layout grid grid-cols-5 gap-x-4">
			<aside className="group py-8 col-span-2 justify-items-start text-slate-700 mb-20">
				<Suspense>{sidebar}</Suspense>
			</aside>
			<main className="col-start-3 col-span-full pt-8 pb-20 *:last:mb-20 scroller">
				<Suspense>{children}</Suspense>
			</main>
		</div>
	);
}
