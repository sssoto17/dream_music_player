import Image from "next/image";
import ImgMusic from "@/assets/img/erik-mclean-QzpgqElvSiA-unsplash.jpg";
import { getLang } from "@/lib/lang";
import { SignupForm } from "./form.client";
import { Suspense } from "react";

export default async function SignUp({ params }) {
	const { locale = "en" } = await params;

	return (
		<main className="row-span-full grid place-content-center place-items-center bg-linear-to-b from-amber-50 to-fuchsia-100">
			<section className="bg-white rounded-md overflow-clip grid xl:grid-cols-2 mx-20 drop-shadow-xl max-w-content">
				<Image
					src={ImgMusic}
					alt=""
					className="hidden xl:block w-full h-full object-cover"
					loading="eager"
				/>
				<Suspense>
					<Form locale={locale} />
				</Suspense>
			</section>
		</main>
	);
}

async function Form({ locale }) {
	const dict = await getLang(locale);
	return (
		<article className="px-16 py-12">
			<header className="mb-8">
				<h1 className="text-3xl mb-4 font-extrabold font-display text-amber-500">
					<span className="block text-sm">Welcome to your </span>
					Dream Music Player
				</h1>
				<p className="max-w-prose">
					Ready to jam out? Fill out your information and get started!
				</p>
			</header>
			<SignupForm lang={dict} />
		</article>
	);
}
