import { makePersisted } from "@solid-primitives/storage";
import type { PropsWithChildren } from "react";
import { type Accessor, createContext, createMemo, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";

const createBookmarksHistoryContext = (userId?: string) => {
	const [ids, setIds] = makePersisted(createStore<number[]>([]), {
		name: `bookmarks-${userId}`,
	});

	const addToHistory = (id: number) => {
		setIds(
			produce((state) => {
				const index = state.indexOf(id);

				if (index !== -1) {
					state.splice(index, 1);
				}

				state.push(id);

				if (state.length > 20) {
					state.splice(0, 1);
				}
			}),
		);
	};

	return { ids, addToHistory };
};

type BookmarksHistoryContextValue = Accessor<
	ReturnType<typeof createBookmarksHistoryContext>
>;

const BookmarksHistoryContext = createContext<BookmarksHistoryContextValue>(
	() => {
		throw new Error("BookmarksHistoryContext is not defined");
	},
);

export const BookmarksHistoryProvider = ({ children }: PropsWithChildren) => {
	const value = createMemo(() => createBookmarksHistoryContext());

	return (
		<BookmarksHistoryContext.Provider value={value}>
			{children}
		</BookmarksHistoryContext.Provider>
	);
};

export const useBookmarksHistory = () => {
	return useContext(BookmarksHistoryContext);
};
