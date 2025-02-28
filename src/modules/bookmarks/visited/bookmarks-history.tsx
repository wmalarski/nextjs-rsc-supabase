import { makePersisted } from "@solid-primitives/storage";
import {
  type Accessor,
  type Component,
  type ParentProps,
  createContext,
  createMemo,
  useContext,
} from "solid-js";
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

export const BookmarksHistoryProvider: Component<ParentProps> = (props) => {
  const value = createMemo(() => createBookmarksHistoryContext());

  return (
    <BookmarksHistoryContext.Provider value={value}>
      {props.children}
    </BookmarksHistoryContext.Provider>
  );
};

export const useBookmarksHistory = () => {
  return useContext(BookmarksHistoryContext);
};
