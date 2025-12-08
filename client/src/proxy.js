import { NextResponse } from "next/server";
import { getLocale } from "./lib/lang";
import { getCookie } from "./features/auth/session";

const authRoutes = ["/dashboard", "/create-account"];
const pubRoutes = ["/login", "/auth/reset"];

const checkAuthRoute = (pathname) => {
	return authRoutes.find((route) => pathname.includes(route));
};

const checkPubRoute = (pathname) => {
	return pubRoutes.find((route) => pathname.includes(route));
};

export default async function proxy(req) {
	const { pathname } = req.nextUrl;

	const locale = getLocale(pathname);
	const session = await getCookie("access_token");

	// AUTH REDIRECTS

	const isAuth = checkAuthRoute(pathname);
	const isPub = checkPubRoute(pathname);

	if (isAuth && !session) {
		req.nextUrl.pathname = !locale ? "/login" : `/${locale}/login`;

		return NextResponse.redirect(
			new URL(req.nextUrl.pathname, req.nextUrl)
		);
	}

	if (isPub && session) {
		req.nextUrl.pathname = !locale ? "/" : `/${locale}`;

		if (
			req.nextUrl.pathname == "/" ||
			req.nextUrl.pathname == `/${locale}`
		) {
			req.nextUrl.pathname = !locale
				? "/dashboard"
				: `/${locale}/dashboard`;
			return NextResponse.rewrite(new URL(req.nextUrl.pathname, req.url));
		}

		return NextResponse.redirect(
			new URL(req.nextUrl.pathname, req.nextUrl)
		);
	}

	// LOCALE URL

	if (!locale) {
		req.nextUrl.pathname = `/en${pathname}`;

		return NextResponse.rewrite(new URL(req.nextUrl.pathname, req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next).*)"],
};
