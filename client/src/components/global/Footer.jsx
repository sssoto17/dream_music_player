import { WebPlayerFooter } from "../musicplayer/WebPlayback";
import { getCookie } from "@/features/auth/session";
import { getAuthUser } from "@/features/auth/dal";

export default async function Footer() {
	const userID = await getCookie("user_id");

	return (
		<footer className="absolute left-0 right-0 bottom-0 text-slate-800 bg-white/80 backdrop-blur-xs px-8 py-4">
			<AuthGuardServer id={userID} />
		</footer>
	);
}

async function AuthGuardServer({ id }) {
	const user = await getAuthUser(id);

	if (!user) return <p>Copyright 2025 S. S. Soto</p>;

	return <WebPlayerFooter {...user} />;
}
