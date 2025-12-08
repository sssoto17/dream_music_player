import { Suspense } from "react";
import AuthGuard from "../(auth)/_components/AuthGuard";

export default function Layout({ children, browse, user }) {
	return (
		<main>
			<section className="grid grid-cols-3 gap-x-6 py-8 ">
				<AuthGuard
					placeholder={
						<div className="bg-white/70 rounded-2xl w-full min-h-160 animate-pulse" />
					}
				>
					{user}
				</AuthGuard>

				<Suspense>{browse}</Suspense>
				<Suspense>{children}</Suspense>
			</section>
		</main>
	);
}
