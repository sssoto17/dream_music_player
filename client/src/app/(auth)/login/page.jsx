import { LogIn as submit } from "../actions";
import fields from "./FormFields.json";
import { Suspense } from "react";

import Link from "next/link";
import Image from "next/image";
import ImgMusic from "@/assets/img/erik-mclean-QzpgqElvSiA-unsplash.jpg";
import { verifySession } from "@/features/auth/session";
import { redirect } from "next/navigation";

export default async function Page() {
  return (
    <main className="grid place-content-center place-items-center h-screen bg-linear-to-b from-amber-50 to-fuchsia-100">
      <Suspense>
        <LogInForm />
      </Suspense>
    </main>
  );
}

async function LogInForm() {
  const { isAuth } = await verifySession();

  if (isAuth) redirect("/dashboard");

  return (
    <section className="bg-white rounded-md overflow-clip grid grid-cols-2 mx-20 drop-shadow-xl">
      <Image
        src={ImgMusic}
        alt=""
        className="w-full max-w-xl h-full max-h-200 object-cover"
        loading="eager"
      />
      <article className="px-16 py-12 grid grid-rows-[auto_1fr_auto] content-start">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold font-display text-amber-500">
            Login
          </h1>
        </header>
        <div>
          <form action={submit}>
            {fields.map(({ name, label, type, testValue, placeholder }, id) => {
              return (
                <div className="grid gap-y-1 py-1.5" key={id}>
                  <label className="font-medium text-slate-800" htmlFor={name}>
                    {label}
                  </label>
                  <input
                    name={name}
                    id={name}
                    className="outline-1 outline-slate-200 rounded-xs py-1 px-2 hover:outline-slate-300 focus:outline-slate-400"
                    type={type}
                    defaultValue={testValue}
                    placeholder={placeholder}
                  />
                </div>
              );
            })}
            <button className="mt-8 py-3 px-6 w-full cursor-pointer rounded-md bg-fuchsia-700 hover:bg-fuchsia-600 text-white text-lg tracking-wider font-bold uppercase font-display">
              Log In
            </button>
          </form>
          <Link
            href="/"
            className="inline-block my-2 text-slate-500 hover:underline hover:opacity-70 transition-all duration-75"
          >
            Forgot password?
          </Link>
        </div>
        <div className="grid justify-center my-12 group *:transition-all *:duration-75">
          <p className="text-center mb-2 text-slate-600 cursor-default group-hover:underline group-hover:opacity-70">
            Don&apos;t have an account?
          </p>
          <Link
            href={`${process.env.AUTH_BASE_URL}/authorize`}
            className="text-center py-3 px-8 cursor-pointer rounded-md bg-slate-800 group-hover:bg-slate-700 text-white text-sm font-semibold uppercase font-display"
          >
            Register with Spotify
          </Link>
        </div>
      </article>
    </section>
  );
}
