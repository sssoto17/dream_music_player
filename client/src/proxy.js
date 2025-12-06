import { NextResponse } from "next/server";

const allowedLocales = ["en", "dk"];

const getLocale = (pathname) => {
	return allowedLocales.find((locale) => pathname.startsWith(`/${locale}`));
};

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
	const session = req.cookies?.get("session")?.value;

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
