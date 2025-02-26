"use client";

import type { User } from "@supabase/supabase-js";
import { type PropsWithChildren, createContext, useContext } from "react";

type UserContextValue = User | null;

const UserContext = createContext<UserContextValue>(null);

type UserContextProviderProps = PropsWithChildren<{
	user: UserContextValue;
}>;

export const UserContextProvider = ({
	children,
	user,
}: UserContextProviderProps) => {
	return <UserContext value={user}>{children}</UserContext>;
};

export const useUserContext = () => {
	return useContext(UserContext);
};

export const useRequiredUserContext = () => {
	const context = useUserContext();

	if (!context) {
		throw new Error("UserContext not defined");
	}

	return context;
};
