import Image from "next/image";
import ImgMusic from "@/assets/img/erik-mclean-QzpgqElvSiA-unsplash.jpg";

export default function LoginLayout({ children }) {
	return (
		<section className="max-w-4xl mx-auto bg-white grid lg:grid-cols-2 place-self-center rounded-md overflow-clip drop-shadow-xl">
			<Image
				src={ImgMusic}
				alt="Dream Music Player"
				className="hidden lg:block object-cover"
				loading="eager"
			/>
			{children}
		</section>
	);
}
