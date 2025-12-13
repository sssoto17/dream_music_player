import Image from "next/image";
import ImgMusic from "@/assets/img/erik-mclean-QzpgqElvSiA-unsplash.jpg";

export default function LoginLayout({ children }) {
	return (
		<section className="bg-white my-8 col-span-full rounded-md overflow-clip grid lg:grid-cols-2 max-w-200 mx-auto drop-shadow-xl">
			<Image
				src={ImgMusic}
				alt=""
				className="hidden lg:block w-full h-full max-w-xl max-h-180 object-cover"
				loading="eager"
			/>
			{children}
		</section>
	);
}
