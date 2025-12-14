import { getAuthUser } from "@/features/auth/dal";
import { redirect } from "next/navigation";
import { getLocalizedHref } from "@/lib/utils";

export default async function Home({ params }) {
	const { locale } = await params;

	const { isAuth } = await getAuthUser();

	if (!isAuth) redirect(getLocalizedHref(locale, "/login"));

	return <div>Hello</div>;
}
