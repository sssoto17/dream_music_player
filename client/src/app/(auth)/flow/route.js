import { redirect } from "next/navigation";
import { createSession } from "@/features/auth/session";

export async function GET(request) {
  await createSession({
    id: request.nextUrl.searchParams.get("id"),
    username: request.nextUrl.searchParams.get("username"),
    access_token: request.nextUrl.searchParams.get("token"),
  });

  // get verification key to ensure user can only access signup flow immediately after signing up

  redirect(
    "/flow/signup"
    // + verification key in search params
  );
}
