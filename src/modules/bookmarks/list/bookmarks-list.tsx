import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { type PropsWithChildren, Suspense, useState } from "react";
import { SELECT_BOOKMARKS_DEFAULT_LIMIT } from "../const";
import type { BookmarkWithTagsModel, SelectBookmarksArgs } from "../services";
import type { FiltersSearchParams } from "../utils";

type BookmarkListProps = {
	queryArgs: SelectBookmarksArgs;
	filterSearchParams: FiltersSearchParams;
	initialBookmarks: BookmarkWithTagsModel[];
	count: number;
};

export const BookmarkList = ({
	filterSearchParams,
	initialBookmarks,
	queryArgs,
}: BookmarkListProps) => {
	const [offsets, setOffsets] = useState<number[]>(
		() => filterSearchParams && [],
	);

	const onLoadMoreClick = () => {
		setOffsets((current) => {
			const lastOffset = current[current.length - 1] ?? 0;
			return [...current, lastOffset + SELECT_BOOKMARKS_DEFAULT_LIMIT + 1];
		});
	};

	return (
		<div className="flex w-full max-w-xl flex-col gap-2 px-2 py-4">
			<div className="flex w-full justify-between gap-2">
				<h2 className="text-xl">Bookmarks</h2>
			</div>
			<BookmarkListContainer>
				<BookmarkListPart bookmarks={initialBookmarks} />
				{offsets.map((offset) => (
					<BookmarkLazy key={offset} offset={offset} queryArgs={queryArgs} />
				))}
			</BookmarkListContainer>
			<Button size="sm" color="secondary" onPress={onLoadMoreClick}>
				Load More
			</Button>
		</div>
	);
};

type BookmarkLazyProps = {
	queryArgs: SelectBookmarksArgs;
	offset: number;
};

const BookmarkLazy = ({ offset, queryArgs }: BookmarkLazyProps) => {
	// const bookmarks = createAsync(() =>
	// 	selectBookmarksQuery({ offset: props.offset, ...props.queryArgs }),
	// );
	console.log({ offset, queryArgs });

	return (
		<Suspense fallback={<BookmarkListLoadingPlaceholder />}>
			<BookmarkListPart bookmarks={[]} />
		</Suspense>
	);
};

type BookmarkListPartProps = {
	bookmarks: BookmarkWithTagsModel[];
};

export const BookmarkListPart = ({ bookmarks }: BookmarkListPartProps) => {
	return (
		<>
			{bookmarks.map((bookmark) => (
				<li key={bookmark.id}>
					<pre>{JSON.stringify(bookmark, null, 2)}</pre>
				</li>
			))}
		</>
	);
};

export const BookmarkListContainer = ({ children }: PropsWithChildren) => {
	return <ul className="flex flex-col gap-4">{children}</ul>;
};

export const BookmarkListPlaceholder = () => {
	return (
		<ul className="flex w-full max-w-xl flex-col gap-2 px-2 py-4">
			<BookmarkListLoadingPlaceholder />
		</ul>
	);
};

const BookmarkListLoadingPlaceholder = () => {
	const list = Array.from({ length: 3 });

	return (
		<>
			{list.map((_value, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<li key={index}>
					<Skeleton className="h-48 w-full" />
				</li>
			))}
		</>
	);
};
