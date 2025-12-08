"use client";

import { getLocalizedHref } from "@/lib/utils";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import {
	Button,
	Popover,
	Menu,
	MenuItem,
	MenuTrigger,
	MenuSection,
	Text,
	Separator,
} from "react-aria-components";
// import LocaleSwitch from "../global/LocaleSwitch";
import { useState } from "react";
import { PiSignOut } from "react-icons/pi";
import { locales, redirectedPathname } from "@/lib/lang";
import Link from "next/link";
import { Logout } from "@/app/[locale]/(auth)/actions";
import { Suspense } from "react";

export function UserTag({
	username,
	first_name,
	last_name,
	avatar,
	size = "default",
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Suspense fallback={<PlaceholderAvatar />}>
			<MenuTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
				<Button className="group cursor-pointer focus:outline-1 focus-within:outline-fuchsia-300 rounded-full">
					<UserAvatar
						username={username}
						avatar={avatar}
						size={size}
					/>
				</Button>
				<Dropdown
					username={username}
					name={`${first_name} ${last_name}`}
				/>
			</MenuTrigger>
		</Suspense>
	);
}

function UserAvatar({ avatar, username, size }) {
	const sizes = {
		sm: "w-8",
		default: "w-12",
		lg: "w-24",
	};

	return (
		<Image
			src={avatar}
			alt={username}
			width={120}
			height={120}
			className={`${sizes[size]} aspect-square object-cover rounded-full drop-shadow-2xl transition-all duration-75 ease-in group-hover:outline-4 outline-amber-100 group-hover:scale-105 group-hover:drop-shadow-4xl`}
		/>
	);
}

export function SignInButton() {
	const { locale } = useParams();
	return (
		<section>
			<Link
				className="block font-semibold text-white py-1 px-8 rounded-full bg-fuchsia-600 hover:bg-fuchsia-700 transition-colors duration-75 ease-in font-copy tracking-wide"
				href={getLocalizedHref(locale, "/login")}
			>
				Login
			</Link>
			{/* <LocaleSwitch active={locale} /> */}
		</section>
	);
}

function Dropdown({ username, name }) {
	const { locale } = useParams();
	return (
		<Popover crossOffset={-256 + 48} isNonModal>
			<Menu className="grid gap-y-2 w-3xs text-lg bg-white text-slate-700 *:transition-all *:duration-75 *:ease-in drop-shadow-md py-2 px-3 rounded-sm focus:outline-0">
				<MenuItem
					className="p-1 group border-b border-b-slate-100 group hover:text-slate-800 flex gap-2 items-center"
					href={getLocalizedHref(locale, `/${username}`)}
				>
					<Text
						slot="label"
						className="grid leading-tight font-medium"
					>
						{name}
						<span className="text-sm text-slate-400 group-hover:text-slate-600">
							@{username}
						</span>
					</Text>
				</MenuItem>
				<Separator />
				<MenuSection className="grid gap-y-1">
					<DropdownItem href="/dashboard">Dashboard</DropdownItem>
					<DropdownItem href="/dashboard/settings">
						Settings
					</DropdownItem>
				</MenuSection>
				<MenuSection>
					<LocaleSwitch />
					<SignOutButton />
				</MenuSection>
			</Menu>
		</Popover>
	);
}

function LocaleSwitch() {
	return (
		<MenuSection className="flex gap-2 items-center px-2 py-1">
			{locales.map((locale, id) => {
				return <LocaleButton key={id} {...locale} />;
			})}
		</MenuSection>
	);
}

function LocaleButton({ lang, label, flag }) {
	const pathname = usePathname();
	const url = redirectedPathname(lang, pathname);

	return (
		<MenuItem
			href={url}
			aria-label={label}
			className="transition-all duration-75 ease-in hover:scale-105"
		>
			<span className={`${flag} aspect-square rounded-full text-xs`} />
			<Text slot="label" className="hidden">
				{label}
			</Text>
			<Text slot="description" className="hidden">
				Switch language to {label}
			</Text>
		</MenuItem>
	);
}

function SignOutButton() {
	const { locale } = useParams();
	return (
		<MenuItem
			onAction={() => Logout(locale)}
			className="flex gap-2 items-center hover:cursor-pointer hover:bg-slate-100 focus:bg-slate-100 hover:font-medium focus:font-medium hover:text-slate-800 focus:text-slate-800 focus:outline-0 px-2 py-1 rounded-sm"
		>
			Sign out
			<PiSignOut size={16} />
		</MenuItem>
	);
}

function DropdownItem({ href, children }) {
	const { locale } = useParams();
	return (
		<MenuItem
			className="hover:bg-slate-100 focus:bg-slate-100 hover:font-medium focus:font-medium hover:text-slate-800 focus:text-slate-800 focus:outline-0 px-2 py-1 rounded-sm"
			href={getLocalizedHref(locale, href)}
		>
			{children}
		</MenuItem>
	);
}

export function PlaceholderAvatar({ size = "default" }) {
	const sizes = {
		sm: "max-w-8 max-h-8",
		default: "max-w-12 max-h-12",
		lg: "max-w-24 max-h-24",
	};

	return (
		<div
			className={`w-full ${sizes[size]} aspect-square rounded-full drop-shadow-md bg-linear-to-b from-amber-50 to-fuchsia-200 animate-pulse`}
		>
			<span className="opacity-0">Loading...</span>
		</div>
	);
}
