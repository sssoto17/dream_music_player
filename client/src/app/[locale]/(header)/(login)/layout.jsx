import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import { Suspense } from "react";
import Image from "next/image";
import ImgMusic from "@/assets/img/erik-mclean-QzpgqElvSiA-unsplash.jpg";
import { getAuthUser } from "@/features/auth/dal";

export default async function Layout({ children, params }) {
	const { locale = "en" } = await params;

	const user = await getAuthUser();

	if (!user)
		return (
			<main className="place-content-center place-items-center">
				<section className="bg-white rounded-md overflow-clip grid grid-cols-2 max-w-content drop-shadow-xl">
					<Image
						src={ImgMusic}
						alt=""
						className="w-full max-w-xl h-full max-h-200 object-cover"
						loading="eager"
					/>
					{children}
				</section>
			</main>
		);

	return children;
}
