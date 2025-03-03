import { ChevronRightIcon } from "@/ui/icons/chevron-right-icon";
import { paths } from "@/utils/paths";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { createVisibilityObserver } from "@solid-primitives/intersection-observer";
import NextLink from "next/link";
import type { PropsWithChildren } from "react";
import { createIsLink } from "~/modules/common/utils/create-is-link";
import { createDateFormatter } from "~/modules/common/utils/formatters";
import { Badge } from "~/ui/badge/badge";
import { LinkButton } from "~/ui/button/button";
import { Card, CardActions, CardBody } from "~/ui/card/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "~/ui/carousel/carousel";
import { DeleteBookmarkForm } from "../forms/delete-bookmark-form";
import { UpdateBookmarkDialog } from "../forms/update-bookmark-dialog";
import type { BookmarkWithTagsModel } from "../services";
import { useBookmarksHistory } from "../visited/bookmarks-history";
import { CompleteDialog } from "./complete-dialog";

type BookmarkListItemProps = {
	bookmark: BookmarkWithTagsModel;
};

export const BookmarkListItem = ({ bookmark }: BookmarkListItemProps) => {
	const formatDate = createDateFormatter();

	const history = useBookmarksHistory();

	const onDetailsClick = () => {
		history.addToHistory(bookmark.id);
	};

	return (
		<Card variant="bordered" size="compact" className="w-full">
			<CardBody className="">
				<BookmarkTagsList bookmark={bookmark} />
				<BookmarkPreview bookmark={bookmark} />
				<Show when={bookmark.title}>
					<BookmarkLinks bookmark={bookmark} />
				</Show>
				<div
					style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 3fr)" }}
					className="grid w-full gap-2 pb-4"
				>
					<GridTitle>Title</GridTitle>
					<GridText>{bookmark.title}</GridText>
					<GridTitle>Text</GridTitle>
					<GridLink bookmarkId={bookmark.id} href={bookmark.text} />
					<GridTitle>Url</GridTitle>
					<GridLink bookmarkId={bookmark.id} href={bookmark.url} />
					<GridTitle>Created at</GridTitle>
					<GridText>{formatDate(bookmark.created_at)}</GridText>
					<GridTitle>Done</GridTitle>
					<GridText>{String(bookmark.done)}</GridText>
					{bookmark.done ? (
						<>
							<GridTitle>Done at</GridTitle>
							<GridText>
								{bookmark.done_at && formatDate(bookmark.done_at)}
							</GridText>
							<GridTitle>Rate</GridTitle>
							<GridText>{bookmark.rate}</GridText>
							<GridTitle>Note</GridTitle>
							<GridText>{bookmark.note}</GridText>
						</>
					) : null}
				</div>
				<CardActions>
					<DeleteBookmarkForm bookmark={bookmark} />
					<CompleteDialog bookmark={bookmark} />
					<UpdateBookmarkDialog bookmark={bookmark} />
					<Button
						onPress={onDetailsClick}
						href={paths.bookmark(bookmark.id)}
						size="sm"
						color="secondary"
					>
						<ChevronRightIcon className="size-4" />
						Details
					</Button>
				</CardActions>
			</CardBody>
		</Card>
	);
};

const GridTitle = ({ children }: PropsWithChildren) => {
	return <span className="font-semibold text-base">{children}</span>;
};

const GridText = ({ children }: PropsWithChildren) => {
	return <span className="break-words">{children}</span>;
};

type GridLinkProps = {
	bookmarkId: number;
	href: string;
};

const GridLink = ({ bookmarkId, href }: GridLinkProps) => {
	const isLink = createIsLink(() => href);

	const history = useBookmarksHistory();

	const onClick = () => {
		history().addToHistory(bookmarkId);
	};

	return (
		<Show when={isLink()} fallback={<GridText>{href}</GridText>}>
			<Link
				as={NextLink}
				onClick={onClick}
				hover={true}
				href={href}
				className="break-words"
			>
				{href}
			</Link>
		</Show>
	);
};

type BookmarkPreviewProps = {
	bookmark: BookmarkWithTagsModel;
};

const BookmarkPreview = ({ bookmark }: BookmarkPreviewProps) => {
	const images = createMemo(() => {
		const array = bookmark.preview
			?.split(";")
			.filter((image) => image.length > 0);
		const smallImages = array?.filter((path) => path.endsWith("-250.jpg"));

		if (smallImages && smallImages.length > 0) {
			return smallImages;
		}

		return array ?? [];
	});

	return (
		<Show when={images().length > 0}>
			<div className="relative mx-auto my-4 w-64">
				<Carousel>
					<CarouselContent>
						<For each={images()}>
							{(image) => (
								<BookmarkPreviewImage image={image} title={bookmark.title} />
							)}
						</For>
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
		</Show>
	);
};

type BookmarkPreviewImageProps = {
	image: string;
	title: string;
};

const BookmarkPreviewImage = ({ image, title }: BookmarkPreviewImageProps) => {
	let el: HTMLDivElement | undefined;
	const useVisibilityObserver = createVisibilityObserver({ threshold: 0.1 });
	const visible = useVisibilityObserver(() => el);
	const shouldShow = createMemo<boolean>((previous) => previous || visible());

	return (
		<CarouselItem ref={el} className="min-h-72">
			<Show when={shouldShow()}>
				<img
					src={image}
					alt={`Preview ${title}`}
					loading="lazy"
					height={250}
					width={250}
					className="h-64 text-base-300"
				/>
			</Show>
		</CarouselItem>
	);
};

type BookmarkTagsListProps = {
	bookmark: BookmarkWithTagsModel;
};

const BookmarkTagsList = ({ bookmark }: BookmarkTagsListProps) => {
	return (
		<ul className="flex flex-row flex-wrap gap-2">
			<For each={bookmark.bookmarks_tags}>
				{(bookmarkTag) => (
					<li>
						<Badge color="accent">{bookmarkTag.tags.name}</Badge>
					</li>
				)}
			</For>
		</ul>
	);
};

type BookmarkLinksProps = {
	bookmark: BookmarkWithTagsModel;
};

const BookmarkLinks = ({ bookmark }: BookmarkLinksProps) => {
	const history = useBookmarksHistory();

	const onClick = () => {
		history().addToHistory(bookmark.id);
	};

	const commonProps: Partial<ComponentProps<typeof LinkButton>> = {
		rel: "noopener noreferrer",
		target: "_blank",
		size: "xs",
		color: "secondary",
		onClick,
	};

	return (
		<ul className="flex flex-row flex-wrap gap-2">
			<li>
				<LinkButton
					{...commonProps}
					href={`https://www.youtube.com/results?${new URLSearchParams({ search_query: bookmark.title })}`}
				>
					Youtube
				</LinkButton>
			</li>
			<li>
				<LinkButton
					{...commonProps}
					href={`https://www.youtube.com/results?${new URLSearchParams({ q: bookmark.title })}`}
				>
					Google
				</LinkButton>
			</li>
			<li>
				<LinkButton
					{...commonProps}
					href={`https://open.spotify.com/search/${bookmark.title}`}
				>
					Spotify
				</LinkButton>
			</li>
		</ul>
	);
};
