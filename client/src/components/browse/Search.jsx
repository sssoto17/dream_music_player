"use client";

import { IoIosSearch } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";
import { startTransition, useActionState, useState } from "react";
import { SearchAction } from "@/features/actions/user_actions";
import Image from "next/image";
import { getLocalizedHref } from "@/lib/utils";
import { useParams } from "next/navigation";

export function SearchBar({ action, value, isPending, children }) {
	function handleSearch(e) {
		const q = new FormData();
		q.append("q", e.target.value);

		startTransition(() => {
			action(q);
		});
	}

	return (
		<form
			action={action}
			onChange={handleSearch}
			className="w-full flex gap-8 max-w-180 mx-auto rounded-2xl bg-white text-slate-700 text-lg font-medium outline-1 py-1.5 px-4 has-focus:outline-slate-300 outline-slate-200 hover:outline-slate-300 transition-all duration-75 drop-shadow-md has-focus:drop-shadow-xl"
		>
			<input
				name="q"
				className="grow focus:outline-0 "
				placeholder={children}
				defaultValue={value}
			/>
			<button
				aria-label="Search"
				className="hover:cursor-pointer disabled:text-slate-400"
				disabled={isPending}
			>
				{isPending ? (
					<ImSpinner2 size={20} className="animate-spin" />
				) : (
					<IoIosSearch size={24} />
				)}
			</button>
		</form>
	);
}

export function MinimalSearchbar({ children }) {
	const [state, submit, isPending] = useActionState(SearchAction);
	const [isOpen, setIsOpen] = useState(false);

	function handleSearch(e) {
		if (isPending || state?.result) {
			setIsOpen(true);
		}
		const q = new FormData();
		q.append("q", e.target.value);

		startTransition(() => {
			submit(q);
		});
	}

	function handleExitSearch() {
		setIsOpen(false);

		startTransition(() => {
			submit();
		});
	}

	const results =
		state?.result &&
		[
			...state?.result?.users,
			...state?.result?.artists,
			...state?.result?.other,
		].toSorted((a, b) => b.popularity - a.popularity);

	return (
		<section className="relative">
			<form
				action={submit}
				onChange={handleSearch}
				className={`group flex ${
					state?.result || isPending
						? "gap-8"
						: "hover:gap-8 has-focus:gap-8"
				} rounded-2xl bg-white text-slate-700 text-lg font-medium hover:outline-1 has-focus:outline-1 py-1.5 px-4 has-focus:outline-slate-300 outline-slate-200 hover:outline-slate-300 transition-all duration-75 ease-in-out hover:drop-shadow-md has-focus:drop-shadow-xl`}
			>
				<input
					name="q"
					className={`transition-all ease-in-out duration-150 grow focus:outline-0 ${
						state?.result || isPending
							? ""
							: "not-group-hover:scale-x-0 not-group-hover:w-0 focus:w-auto focus:scale-x-100"
					}`}
					placeholder={children}
					defaultValue={state?.q}
				/>
				<button
					aria-label="Search"
					className="hover:cursor-pointer group-has-focus:text-fuchsia-700 disabled:text-slate-400"
					disabled={isPending}
				>
					{isPending ? (
						<ImSpinner2 size={20} className="animate-spin" />
					) : (
						<IoIosSearch size={24} />
					)}
				</button>
			</form>
			{isOpen && (
				<SearchResultsBox
					results={results}
					loading={isPending}
					isActve={isOpen}
					exitAction={handleExitSearch}
				/>
			)}
		</section>
	);
}

import { IoMdCloseCircleOutline } from "react-icons/io";

function SearchResultsBox({ results, loading, isActive, exitAction }) {
	return (
		<article
			className={`${
				!isActive ? "" : "h-0 opacity-0"
			} absolute bg-white px-4 r-0 min-w-60 w-full drop-shadow-sm rounded-md mt-4 z-50`}
		>
			<div className="relative">
				<button
					aria-label="Close search"
					onClick={exitAction}
					className="text-slate-600 group transition-all duration-75 ease-in absolute py-2 w-full grid justify-items-end items-end"
				>
					<IoMdCloseCircleOutline className="z-20 hover:scale-105 hover:cursor-pointer" />
				</button>

				<ul className="max-h-100 py-8 overflow-y-scroll scroller">
					{loading ? (
						<SearchPlaceholder />
					) : (
						results.map((item) => {
							return (
								<SearchResult
									key={item.id}
									{...item}
									artist={
										item?.type == "album" ||
										item?.type == "track"
											? item?.artists
													?.map(
														(artist) => artist.name
													)
													.join(", ")
											: item?.name
									}
									url={
										item?.type == "album"
											? `/browse/album/${item?.id}`
											: item?.type == "track"
											? `/browse/album/${item?.abum?.id}`
											: item?.type == "artist"
											? `/browse/artist/${item?.id}`
											: `/user/${item.username}`
									}
									img={
										item?.type == "album" ||
										item?.type == "artist"
											? item.images[2]
											: item?.type == "track"
											? item.album.images[2]
											: {
													url: item.avatar,
													width: 100,
													height: 100,
											  }
									}
								/>
							);
						})
					)}
				</ul>
			</div>
		</article>
	);
}

function SearchPlaceholder() {
	return (
		<>
			<li className="flex gap-4 py-2 text-base animate-pulse">
				<div className="aspect-square w-12 bg-slate-300 rounded-md" />
				<div className="grow *:not-last:mb-2 *:bg-slate-300">
					<div className="w-full h-4 rounded-md" />
					<div className="w-full h-2 rounded-md" />
				</div>
			</li>
			<li className="flex gap-4 py-2 text-base animate-pulse">
				<div className="aspect-square w-12 bg-slate-200 rounded-md" />
				<div className="grow *:not-last:mb-2 *:bg-slate-200">
					<div className="w-full h-4 rounded-md" />
					<div className="w-full h-2 rounded-md" />
				</div>
			</li>
			<li className="flex gap-4 py-2 text-base animate-pulse">
				<div className="aspect-square w-12 bg-slate-100 rounded-md" />
				<div className="grow *:not-last:mb-2 *:bg-slate-100">
					<div className="w-full h-4 rounded-md" />
					<div className="w-full h-2 rounded-md" />
				</div>
			</li>
			<li className="flex gap-4 py-2 text-base animate-pulse">
				<div className="aspect-square w-12 bg-slate-50 rounded-md" />
				<div className="grow *:not-last:mb-2 *:bg-slate-50">
					<div className="w-full h-4 rounded-md" />
					<div className="w-full h-2 rounded-md" />
				</div>
			</li>
		</>
	);
}

function SearchResult({
	img,
	name,
	username,
	first_name,
	last_name,
	artist,
	url,
}) {
	const { locale } = useParams();
	return (
		<li className="flex gap-4 py-2 text-sm transition-all duration-75 ease-in relative p-2 mr-2 rounded-md group hover:bg-slate-100">
			<Image
				src={img?.url}
				width={img?.width}
				height={img?.height}
				alt={name || username}
				className="aspect-square object-cover w-12 rounded-md"
			/>
			<header>
				<h4 className="text-lg font-semibold group-hover:text-slate-900">
					<a
						className="after:absolute after:inset-0"
						href={getLocalizedHref(locale, url)}
					>
						{name || `${first_name} ${last_name}`}
					</a>
				</h4>
				<p>{artist || `@${username}`}</p>
			</header>
		</li>
	);
}
