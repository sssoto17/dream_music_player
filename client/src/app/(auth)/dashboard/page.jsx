import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getAuthUser } from "@/features/auth/dal";

export default function Dashboard() {
  return (
    <main>
      <Suspense>
        <UserProfile />
      </Suspense>
    </main>
  );
}

async function UserProfile() {
  const user = await getAuthUser();

  const userAvatar = `${process.env.SERVER}/${user.avatar}`;

  return (
    <section>
      <h3>Hello {user.username}</h3>
      <Link href="/logout">Sign out</Link>
      <Image src={userAvatar} alt="User avatar" width={400} height={500} />
    </section>
  );
}
