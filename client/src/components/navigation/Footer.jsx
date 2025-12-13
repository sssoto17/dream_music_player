import { Suspense } from "react";
import { WebPlayerFooter } from "../musicplayer/WebPlayback";
import { getAuthUser } from "@/features/auth/dal";

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
	const { isAuth, user } = await getAuthUser();

	if (!isAuth) return <p>Copyright 2025 S. S. Soto</p>;

	return <WebPlayerFooter {...user} />;
}
