import Image from "next/image";
import ImgMusic from "@/assets/img/erik-mclean-QzpgqElvSiA-unsplash.jpg";

export default function LoginLayout({ children }) {
	return (
		<main className="grid place-content-center place-items-center min-h-screen px-8 bg-linear-to-b from-amber-50 to-fuchsia-100">
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
}
