import Image from "next/image";
import ImgMusic from "@/assets/img/erik-mclean-QzpgqElvSiA-unsplash.jpg";
import { Suspense } from "react";

export default function LoginLayout({ children }) {
	return (
		<main className="place-content-center place-items-center">
			<section className="bg-white rounded-md overflow-clip grid grid-cols-2 max-w-content drop-shadow-xl">
				<Image
					src={ImgMusic}
					alt=""
					className="w-full max-w-xl h-full max-h-200 object-cover"
					loading="eager"
				/>
				<Suspense>{children}</Suspense>
			</section>
		</main>
	);
}
