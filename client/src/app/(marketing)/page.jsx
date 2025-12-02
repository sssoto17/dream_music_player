import { verifySession } from "@/features/auth/session";
import { getUsers } from "@/features/db/users";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  const imgSrc = `${process.env.SERVER}/static/uploads/20250907_2003031.jpg`;
  return (
    <main className="h-screen">
      <h1>Home</h1>
      <Link className="block" href="/login">
        Login
      </Link>
      <Link className="block" href={`/album/${process.env.SPOTIFY_TEST_ALBUM}`}>
        Go to album
      </Link>
      <Image src={imgSrc} width={400} height={400} alt="" />
      <Suspense>
        <Test />
      </Suspense>
    </main>
  );
}

async function Test() {
  // TESTING AUTH SCOPING
  const authUser = await verifySession();

  if (!authUser) {
    console.log("not authenticated");
    return;
  }

  // TESTING FETCH WITH SQLALCHEMY QUERIES
  const user = await getUsers(39);

  if (user.error) {
    return <p>No user found.</p>;
  }

  return (
    <div>
      <p> {user.username} </p>
    </div>
  );
}
