import { WebPlayerFooter } from "../musicplayer/WebPlayback";
import { getCookie } from "@/features/auth/session";
import { getAuthUser } from "@/features/auth/dal";
import { Suspense } from "react";

export default async function Footer() {
	return (
		<footer className="absolute left-0 right-0 bottom-0 text-slate-800 bg-white/80 backdrop-blur-xs px-8 py-4">
			<Suspense>
				<Navigation />
			</Suspense>
		</footer>
	);
}

async function Navigation() {
	const user_id = await getCookie("user_id");
	const user = await getAuthUser(user_id);

	if (!user) return <p>Copyright 2025 S. S. Soto</p>;

	return <WebPlayerFooter {...user} />;
}
