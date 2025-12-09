"use client";

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
import LocaleSwitch from "../navigation/LocaleSwitch";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PiSignOut } from "react-icons/pi";
import { Logout } from "@/features/actions/auth_actions";
import { Suspense } from "react";
import { getLocalizedHref } from "@/lib/utils";
import { AvatarIcon, AvatarFallback } from "./Avatar";

export function UserTag({
	username,
	first_name,
	last_name,
	avatar,
	size = "default",
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Suspense fallback={<AvatarFallback />}>
			<MenuTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
				<Button className="group cursor-pointer focus:outline-1 focus-within:outline-fuchsia-300 rounded-full">
					<AvatarIcon
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

function Dropdown({ username, name }) {
	const { locale } = useParams();
	return (
		<Popover crossOffset={-256 + 48} isNonModal>
			<Menu className="grid gap-y-2 w-3xs text-lg bg-white text-slate-700 *:transition-all *:duration-75 *:ease-in drop-shadow-md py-2 px-3 rounded-sm focus:outline-0">
				<MenuItem
					className="p-1 group border-b border-b-slate-100 group hover:text-slate-800 flex gap-2 items-center"
					href={getLocalizedHref(locale, `/user/${username}`)}
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
					<DropdownItem
						href={getLocalizedHref(locale, "/user/dashboard")}
					>
						Dashboard
					</DropdownItem>
					<DropdownItem
						href={getLocalizedHref(
							locale,
							"/user/dashboard/settings"
						)}
					>
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
