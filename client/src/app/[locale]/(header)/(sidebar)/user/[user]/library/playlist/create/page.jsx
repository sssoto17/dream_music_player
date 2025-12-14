import { FormInput } from "@/components/form/Form";
import { FaMusic } from "react-icons/fa6";

export default function CreatePlaylist() {
	return (
		<section className="px-20 py-16 bg-white drop-shadow-xl rounded-xl">
			<header className="py-8">
				<h2 className="flex gap-4 text-4xl font-bold font-display">
					<FaMusic /> Create playlist
				</h2>
			</header>
			<form
				action="
			"
			>
				<FormInput>Title</FormInput>
				<FormInput>Title</FormInput>
			</form>

			<ul></ul>
		</section>
	);
}
