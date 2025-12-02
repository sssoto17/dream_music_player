import { FaPlay } from "react-icons/fa";
import { formatDuration } from "@/lib/utils";

export default function TrackList({ items }) {
  return (
    <ol className="py-8 *:not-first:mt-2">
      {items.map((track) => (
        <Track key={track.id} {...track} />
      ))}
    </ol>
  );
}

export function Track({ name, duration_ms, track_number }) {
  const number = track_number.toString().padStart(2, "0");
  const duration = formatDuration(duration_ms);

  return (
    <li className="flex align-bottom gap-2 w-full py-4 px-1 hover:bg-white/60 cursor-pointer">
      <button>
        <FaPlay size={12} />
      </button>
      <p className="grow">
        <span className="text-xs mr-2">{number}</span> {name}
      </p>
      <p className="text-xs">{duration}</p>
    </li>
  );
}
