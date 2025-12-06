import { redirect } from "next/navigation";
import { verifySession } from "@/features/auth/session";

export default async function AuthSession({ children }) {
  const { isAuth } = await verifySession();

  if (!isAuth) redirect("/login");

  return children;
}
