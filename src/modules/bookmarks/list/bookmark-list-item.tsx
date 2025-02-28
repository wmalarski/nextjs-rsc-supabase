import { createVisibilityObserver } from "@solid-primitives/intersection-observer";
import type { PropsWithChildren } from "react";
import { type ComponentProps, For, Show, createMemo } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import { createIsLink } from "~/modules/common/utils/create-is-link";
import { createDateFormatter } from "~/modules/common/utils/formatters";
import { paths } from "~/modules/common/utils/paths";
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
import { ChevronRightIcon } from "~/ui/icons/chevron-right-icon";
import { Link } from "~/ui/link/link";
import { useBookmarksHistory } from "../contexts/bookmarks-history";
import type { BookmarkWithTagsModel } from "../server";
import { CompleteDialog } from "./complete-dialog";
import { DeleteBookmarkForm } from "./delete-bookmark-form";
import { UpdateBookmarkDialog } from "./update-bookmark-dialog";

type BookmarkListItemProps = {
	bookmark: BookmarkWithTagsModel;
};

export const BookmarkListItem = ({ bookmark }: BookmarkListItemProps) => {
	const { t } = useI18n();

	const formatDate = createDateFormatter();

	const history = useBookmarksHistory();

	const onDetailsClick = () => {
		history().addToHistory(bookmark.id);
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
					<GridTitle>{t("bookmarks.item.title")}</GridTitle>
					<GridText>{bookmark.title}</GridText>
					<GridTitle>{t("bookmarks.item.text")}</GridTitle>
					<GridLink bookmarkId={bookmark.id} href={bookmark.text} />
					<GridTitle>{t("bookmarks.item.url")}</GridTitle>
					<GridLink bookmarkId={bookmark.id} href={bookmark.url} />
					<GridTitle>{t("bookmarks.item.createdAt")}</GridTitle>
					<GridText>{formatDate(bookmark.created_at)}</GridText>
					<GridTitle>{t("bookmarks.item.done")}</GridTitle>
					<GridText>{String(bookmark.done)}</GridText>
					<Show when={bookmark.done}>
						<GridTitle>{t("bookmarks.item.doneAt")}</GridTitle>
						<GridText>
							{bookmark.done_at && formatDate(bookmark.done_at)}
						</GridText>
						<GridTitle>{t("bookmarks.item.rate")}</GridTitle>
						<GridText>{bookmark.rate}</GridText>
						<GridTitle>{t("bookmarks.item.note")}</GridTitle>
						<GridText>{bookmark.note}</GridText>
					</Show>
				</div>
				<CardActions>
					<DeleteBookmarkForm bookmark={bookmark} />
					<CompleteDialog bookmark={bookmark} />
					<UpdateBookmarkDialog bookmark={bookmark} />
					<LinkButton
						onClick={onDetailsClick}
						href={paths.bookmark(bookmark.id)}
						size="sm"
						color="secondary"
					>
						<ChevronRightIcon className="size-4" />
						{t("bookmarks.item.details")}
					</LinkButton>
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
			<Link onClick={onClick} hover={true} href={href} className="break-words">
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
	const { t } = useI18n();

	let el: HTMLDivElement | undefined;
	const useVisibilityObserver = createVisibilityObserver({ threshold: 0.1 });
	const visible = useVisibilityObserver(() => el);
	const shouldShow = createMemo<boolean>((previous) => previous || visible());

	return (
		<CarouselItem ref={el} className="min-h-72">
			<Show when={shouldShow()}>
				<img
					src={image}
					alt={t("bookmarks.item.preview", { preview: title })}
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
	const { t } = useI18n();

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
					{t("bookmarks.item.youtube")}
				</LinkButton>
			</li>
			<li>
				<LinkButton
					{...commonProps}
					href={`https://www.youtube.com/results?${new URLSearchParams({ q: bookmark.title })}`}
				>
					{t("bookmarks.item.google")}
				</LinkButton>
			</li>
			<li>
				<LinkButton
					{...commonProps}
					href={`https://open.spotify.com/search/${bookmark.title}`}
				>
					{t("bookmarks.item.spotify")}
				</LinkButton>
			</li>
		</ul>
	);
};
