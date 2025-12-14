"use client";

import Form from "next/form";
import { FormTextArea } from "../form/Form";
import { useActionState } from "react";
import { PostAction } from "@/features/actions/user_actions";
import { AvatarIcon } from "./Avatar";
import Link from "next/link";
import { getLocalizedHref } from "@/lib/utils";
import { MdOutlinePermMedia } from "react-icons/md";
import { useParams } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function UserFeed({ user, feed }) {
	const { user: username } = useParams();
	const [state, submit, isPending] = useActionState(PostAction, {
		filterByUser: Boolean(username),
		feed,
	});

	return (
		<>
			<UserPostForm
				user={user}
				rows={2}
				{...state}
				submit={submit}
				isPending={isPending}
			/>
			<Posts {...state} isPending={isPending} />
		</>
	);
}

export function UserPostForm({ user, rows, submit, isPending }) {
	return (
		<section className="grid place-items-center *:w-full *:max-w-lg border-b border-slate-200">
			<UserLabel {...user} />
			<Form action={submit} className="grid gap-y-2 py-4">
				<FormTextArea disabled={isPending} name="post" rows={rows}>
					Anything to share?
				</FormTextArea>
				<footer className="flex justify-end gap-4 items-center">
					<button
						className="relative text-amber-900 w-6 aspect-square group"
						aria-label="Add media to post"
					>
						<MdOutlinePermMedia
							size={24}
							className="group-hover:text-fuchsia-800 transition-all duration-75 ease-in"
						/>
						<input
							name="media"
							type="file"
							accept="image/*,video/*,.pdf"
							className="absolute inset-0 after:absolute after:inset-0 cursor-pointer w-6 h-6 opacity-0"
							multiple
						/>
					</button>
					<button className="bg-fuchsia-600 my-2 text-white text-lg py-1 px-8 w-full max-w-4xs cursor-pointer hover:bg-fuchsia-500 transition-colors duration-75 ease-in rounded-md font-bold justify-self-end">
						Post
					</button>
				</footer>
			</Form>
		</section>
	);
}

export function UserLabel({ username, first_name, last_name, avatar }) {
	const { locale = "en" } = useParams();
	return (
		<header className="relative flex gap-2 items-end font-display hover:text-fuchsia-950 transition-colors duration-75 ease-in">
			<AvatarIcon size="iconsm" avatar={avatar} username={username} />
			<div>
				<h3 className="font-black leading-tight">
					<Link
						href={getLocalizedHref(locale, `/user/${username}`)}
						className="after:absolute after:inset-0"
					>
						{first_name} {last_name}
					</Link>
				</h3>
				{username && (
					<p className="text-xs/tight text-slate-600">@{username}</p>
				)}
			</div>
		</header>
	);
}

function Posts({ feed, isPending }) {
	return (
		<section className="max-h-3/5 overflow-y-scroll hover:scroller not-hover:scroller-hidden">
			{isPending && <PostLoader />}
			{feed.length ? (
				feed.map((post) => {
					return <UserPost key={post.id} {...post} />;
				})
			) : (
				<article className="py-8 text-slate-500 text-center">
					<p>No posts yet.</p>
				</article>
			)}
		</section>
	);
}

import { FaShare, FaRegComment } from "react-icons/fa";

function UserPost({ content, created, author, likes }) {
	const date = new Date(created);
	const post_created = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

	return (
		<article className="py-4 grid gap-2 not-last:border-b border-slate-200">
			<UserLabel {...author} />
			<p className="text-slate-700 text-xl px-2">{content}</p>
			<footer className="px-2 flex justify-between text-sm">
				<p className="cursor-default text-slate-500">{post_created}</p>
				<ul className="flex gap-4 justify-end items-center *:grid *:hover:text-fuchsia-700 *:transition-all *:ease-in *:duration-75">
					<li>
						<button className="cursor-pointer ">
							<FaRegHeart size={20} /> {!likes ? "" : likes}
						</button>
					</li>
					<li>
						<Link href="/">
							<FaRegComment size={20} />
						</Link>
					</li>
					<li>
						<Link href="/">
							<FaShare size={20} />
						</Link>
					</li>
				</ul>
			</footer>
		</article>
	);
}

import { ImSpinner2 } from "react-icons/im";
function PostLoader() {
	return (
		<article className="animate-pulse py-4 flex items-center gap-2 not-last:border-b border-slate-200">
			<UserLabel />
			<ImSpinner2
				size={24}
				className="animate-spin grow justify-self-center text-fuchsia-900"
			/>
		</article>
	);
}
