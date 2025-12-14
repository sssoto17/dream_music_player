import { Suspense } from "react";

export default function NoSidebarLayout({ children }) {
	return (
		<main className="h-full overflow-y-scroll overflow-x-visible grid pt-8 pb-40 *:last:mb-20 scroller">
			<Suspense>{children}</Suspense>
		</main>
	);
}
