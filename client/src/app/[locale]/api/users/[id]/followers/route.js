import { NextResponse } from "next/server";
import { cacheLife } from "next/cache";
import { getAvatarSrc } from "@/lib/utils";

const { API_BASE: api_url } = process.env;

export async function GET(req, { params }) {
	const { id } = await params;

	const res = await getUserFollowers(id);

	if (res?.error) {
		return NextResponse.json({ error: "No user with matching ID." });
	}

	const users = res.map((user) => {
		if (user.avatar) {
			user.avatar = getAvatarSrc(user.avatar);
		}

		return user;
	});

	return new NextResponse(JSON.stringify(users), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

async function getUserFollowers(id) {
	"use cache";
	cacheLife("seconds");

	const res = await fetch(`${api_url}/users/${id}/followers`);

	if (!res.ok) return { error: "Could not complete request." };

	return await res.json();
}
