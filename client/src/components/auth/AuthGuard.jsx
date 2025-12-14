"use client";
import { useAuth } from "@/features/hooks/useAuth";

export default function AuthGuard({ children, placeholder, loader }) {
	const { isAuth, isLoading } = useAuth();

	if (isLoading) return loader;

	if (!isAuth) return placeholder;

	return children;
}
