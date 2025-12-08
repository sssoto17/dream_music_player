"use client";
import { useAuth } from "@/hooks/useAuth";

export default function AuthGuard({ children, placeholder }) {
	const { isAuth, isLoading } = useAuth();

	if (isLoading) return placeholder;

	if (!isAuth) return;

	return children;
}
