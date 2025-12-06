import { redirect } from "next/navigation";
import { deleteSession } from "@/features/auth/session";

export async function GET() {
  await deleteSession();

  redirect("/login");
}
