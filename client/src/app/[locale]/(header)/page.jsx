import Browse from "@/components/browse/Browse";
import { getAuthUser } from "@/features/auth/dal";
import { redirect } from "next/navigation";
import { getLocalizedHref } from "@/lib/utils";

export default async function Home({ params }) {
	const { locale } = await params;

	const { isAuth } = await getAuthUser();

	if (!isAuth) redirect(getLocalizedHref(locale, "/login"));

	return (
		<section className="col-start-2 col-span-full">
			<Browse />
		</section>
	);
}
