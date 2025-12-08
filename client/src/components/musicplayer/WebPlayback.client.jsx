"use client";

import { useState } from "react";
import {
	FaPlay,
	FaPause,
	FaStepForward,
	FaForward,
	FaStepBackward,
	FaBackward,
	FaCircle,
} from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";
// import { useWebPlayer } from "../../features/spotify/hooks";
import { formatDuration, formatTrackProgress } from "../../lib/utils";

export default function PlaybackInterface({ track }) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLooping, setIsLooping] = useState(false);
	const [currentTrack, setCurrentTrack] = useState(track || null);
	const [trackProgress, setTrackProgress] = useState(0);

	// 	const player = useWebPlayer(token, 0.5);

	// 	if (player == undefined) {
	// 		console.log("invalid token");
	// 	}

	// 	function handlePlay() {
	// 		player?.activateElement();

	// 		player?.togglePlay();

	// 		player?.getCurrentState().then((state) => {
	// 			if (!state) {
	// 				console.log(
	// 					"User is not playing music through the Web Playback SDK"
	// 				);
	// 				return;
	// 			}

	// 			const {
	// 				track_window: { current_track },
	// 			} = state;

	// 			setCurrentTrack(current_track);
	// 		});

	// 		setIsPlaying(!isPlaying);
	// 	}

	// 	player?.addListener("player_state_changed", (props) => {
	// 		if (props) {
	// 			const {
	// 				track_window: { current_track },
	// 				paused,
	// 				position,
	// 			} = props;
	// 			setCurrentTrack(current_track);
	// 			setIsPlaying(!paused);
	// 			setTrackProgress(position);
	// 		}
	// 	});

	// 	function handleNext() {
	// 		player?.nextTrack();
	// 	}

	// const playbackProps = {
	// 	track: currentTrack,
	// 	progress: trackProgress,
	// 	isPlaying: isPlaying,
	// 	isLooping: isLooping,
	// 	controls: {
	// 		play: handlePlay,
	// 		next: handleNext,
	// 		loop: setIsLooping,
	// 	},
	// };

	return (
		<nav className="mx-auto max-w-content px-8 *:py-4 flex flex-wrap gap-x-6 justify-center items-center">
			{/* <article className="absolute left-0 right-0 bottom-0 bg-slate-50/60 backdrop-blur-xs px-8 py-4 *:py-4 flex flex-wrap gap-x-6 justify-center items-center"> */}
			<PlaybackControls
				// {...playbackProps}
				isDisabled={false}
			/>
			<PlaybackProgress
			// {...playbackProps}
			/>
		</nav>
	);
}

function PlaybackControls({
	isPlaying,
	isLooping,
	// controls: { play, next, loop },
	isDisabled,
}) {
	return (
		<header className="*:disabled:opacity-40 [button]:not-disabled:hover:scale-110 [button]:not-disabled:cursor-pointer flex gap-2 text-lg content-center items-center">
			<button disabled={isDisabled}>
				<FaStepBackward />
			</button>
			<button disabled={isDisabled}>
				<FaBackward />
			</button>
			<button
				className="mx-3 text-xl transition-all duration-150"
				// onClick={() => play()}
				disabled={isDisabled}
			>
				{isPlaying ? <FaPause /> : <FaPlay />}
			</button>
			<button disabled={isDisabled}>
				<FaForward />
			</button>
			<button
				disabled={isDisabled}
				// onClick={() => next()}
			>
				<FaStepForward />
			</button>
			<div className="[button]:hover:scale-110 *:not-disabled:opacity-40 mx-2 text-xs flex items-center">
				<button
					disabled={isDisabled}
					{...(isLooping && { "data-active": "" })}
					className="transition-all duration-150 data-active:text-amber-400"
					// onClick={() => loop(!isLooping)}
				>
					<FaArrowRotateLeft />
				</button>
			</div>
		</header>
	);
}

function PlaybackProgress({ duration_ms, progress, isPlaying, isLooping }) {
	const trackProgress =
		formatTrackProgress(duration_ms, progress) == 100 ||
		isNaN(formatTrackProgress(duration_ms, progress))
			? 0
			: formatTrackProgress(duration_ms, progress);
	const animationState = `${trackProgress}%`;
	const props = {
		"--playback-duration": `${duration_ms}ms`,
		"--playback-state": isPlaying ? "running" : "paused",
		"--playback-progress": animationState,
	};

	return (
		<>
			<article>
				<p className="text-sm">
					{duration_ms ? formatDuration(progress) : formatDuration(0)}
				</p>
			</article>
			<div className="group hover:cursor-pointer grow min-w-65 h-full grid *:row-span-full *:col-span-full items-center">
				<div
					style={props}
					className={`h-1 bg-black/50 rounded-sm relative before:absolute before:inset-0 before:bg-amber-400 before:w-(--playback-progress)
              ${
					isLooping
						? "before:animate-playback-infinite"
						: "before:animate-playback-1"
				}`}
				/>
				<FaCircle
					size={10}
					className="-translate-x-1/2 absolute not-group-hover:hidden"
				/>
			</div>
			<article>
				<p className="text-sm">
					{duration_ms
						? formatDuration(duration_ms)
						: formatDuration(0)}
				</p>
			</article>
		</>
	);
}
