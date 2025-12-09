import { FaPlay } from "react-icons/fa";
import {} from "react-icons/fa";
import { formatDuration } from "@/lib/utils";
import LikeButton from "../user/Buttons";

export default function TrackList({ items, displayNo }) {
	return (
		<ol className="*:not-first:mt-2 overflow-y-scroll max-h-100 scroller">
			{items.map((track) => (
				<Track key={track.id} {...track} displayNo={displayNo} />
			))}
		</ol>
	);
}

export function Track({
	id,
	name,
	duration_ms,
	track_number,
	displayNo = true,
}) {
	const number = track_number.toString().padStart(2, "0");
	const duration = formatDuration(duration_ms);

	return (
		<li className="group flex align-bottom items-center gap-2 w-full py-4 px-1 hover:font-semibold hover:text-amber-900 hover:bg-white/60 cursor-pointer">
			<button>
				<FaPlay size={12} />
			</button>
			<p className="grow">
				<span className="text-xs mr-2">{displayNo && number}</span>{" "}
				{name}
			</p>
			<LikeButton trackId={id} />
			<p className="text-xs">{duration}</p>
		</li>
	);
}
