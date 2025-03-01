import {
	type PropsWithChildren,
	createContext,
	useContext,
	useState,
} from "react";

const getLocalStorageValue = (userId: string) => {
	if (typeof window === "undefined") {
		return [];
	}

	const serialized = localStorage.get(`bookmarks-${userId}`);

	if (!serialized) {
		return [];
	}

	const parsed = JSON.parse(serialized);

	return parsed as number[];
};

const useBookmarksHistoryContext = (userId: string) => {
	const [ids, setIds] = useState<number[]>(getLocalStorageValue(userId));

	const addToHistory = (id: number) => {
		const newState = [...ids];
		const index = newState.indexOf(id);

		if (index !== -1) {
			newState.splice(index, 1);
		}

		newState.push(id);

		if (newState.length > 20) {
			newState.splice(0, 1);
		}

		setIds(newState);
	};

	return { ids, addToHistory };
};

type BookmarksHistoryContextValue = ReturnType<
	typeof useBookmarksHistoryContext
>;

const BookmarksHistoryContext =
	createContext<BookmarksHistoryContextValue | null>(null);

type BookmarksHistoryProviderProps = PropsWithChildren<{
	userId: string;
}>;

const Provider = ({ children, userId }: BookmarksHistoryProviderProps) => {
	const value = useBookmarksHistoryContext(userId);

	return (
		<BookmarksHistoryContext value={value}>{children}</BookmarksHistoryContext>
	);
};

export const BookmarksHistoryProvider = ({
	children,
	userId,
}: BookmarksHistoryProviderProps) => {
	const key = `${userId}-${typeof window}`;
	return (
		<Provider key={key} userId={userId}>
			{children}
		</Provider>
	);
};

export const useBookmarksHistory = () => {
	const context = useContext(BookmarksHistoryContext);

	if (!context) {
		throw new Error("BookmarksHistoryContext is not defined");
	}

	return context;
};
