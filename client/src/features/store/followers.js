import { createStore } from "zustand";
import { createContext } from "react";

export const createFollowersStore = (props) => {
	const defaultStore = { followers: 0 };

	return createStore()((set) => ({
		...defaultStore,
		...props,
		toggleFollow: () =>
			set((state) => ({
				isFollowing: !state.isFollowing ? true : false,
				followers: !state.isFollowing
					? ++state.followers
					: --state.followers,
			})),
		addFollower: () =>
			set((state) => ({
				followers: ++state.followers,
			})),
		removeFollower: () =>
			set((state) => ({
				followers: --state.followers,
			})),
	}));
};

export const FollowersContext = createContext(null);
