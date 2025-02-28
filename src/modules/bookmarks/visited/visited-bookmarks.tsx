import { createAsync } from "@solidjs/router";
import type { Component } from "solid-js";
import { useBookmarksHistory } from "~/modules/bookmarks/contexts/bookmarks-history";
import { RpcShow } from "~/modules/common/components/rpc-show";
import { ClientOnly } from "~/ui/client-only/client-only";
import { selectBookmarksByIdsQuery } from "../client";
import { BookmarkListContainer, BookmarkListPart } from "./bookmark-list";

export const VisitedBookmarks: Component = () => {
  return (
    <ClientOnly>
      <ClientVisitedBookmarks />
    </ClientOnly>
  );
};

const ClientVisitedBookmarks: Component = () => {
  const history = useBookmarksHistory();

  const bookmarks = createAsync(() =>
    selectBookmarksByIdsQuery({
      bookmarkIds: history().ids,
    }),
  );

  return (
    <RpcShow result={bookmarks()}>
      {(bookmarks) => {
        const map = new Map(bookmarks().data.map((entry) => [entry.id, entry]));
        const matched = history().ids.flatMap((id) => {
          const value = map.get(id);
          return value ? [value] : [];
        });
        return (
          <BookmarkListContainer>
            <BookmarkListPart bookmarks={matched} />
          </BookmarkListContainer>
        );
      }}
    </RpcShow>
  );
};
