import { createVisibilityObserver } from "@solid-primitives/intersection-observer";
import {
  type Component,
  type ComponentProps,
  For,
  type ParentProps,
  Show,
  createMemo,
} from "solid-js";
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

export const BookmarkListItem: Component<BookmarkListItemProps> = (props) => {
  const { t } = useI18n();

  const formatDate = createDateFormatter();

  const history = useBookmarksHistory();

  const onDetailsClick = () => {
    history().addToHistory(props.bookmark.id);
  };

  return (
    <Card variant="bordered" size="compact" class="w-full">
      <CardBody class="">
        <BookmarkTagsList bookmark={props.bookmark} />
        <BookmarkPreview bookmark={props.bookmark} />
        <Show when={props.bookmark.title}>
          <BookmarkLinks bookmark={props.bookmark} />
        </Show>
        <div
          style={{ "grid-template-columns": "minmax(0, 1fr) minmax(0, 3fr)" }}
          class="grid w-full gap-2 pb-4"
        >
          <GridTitle>{t("bookmarks.item.title")}</GridTitle>
          <GridText>{props.bookmark.title}</GridText>
          <GridTitle>{t("bookmarks.item.text")}</GridTitle>
          <GridLink bookmarkId={props.bookmark.id} href={props.bookmark.text} />
          <GridTitle>{t("bookmarks.item.url")}</GridTitle>
          <GridLink bookmarkId={props.bookmark.id} href={props.bookmark.url} />
          <GridTitle>{t("bookmarks.item.createdAt")}</GridTitle>
          <GridText>{formatDate(props.bookmark.created_at)}</GridText>
          <GridTitle>{t("bookmarks.item.done")}</GridTitle>
          <GridText>{String(props.bookmark.done)}</GridText>
          <Show when={props.bookmark.done}>
            <GridTitle>{t("bookmarks.item.doneAt")}</GridTitle>
            <GridText>
              {props.bookmark.done_at && formatDate(props.bookmark.done_at)}
            </GridText>
            <GridTitle>{t("bookmarks.item.rate")}</GridTitle>
            <GridText>{props.bookmark.rate}</GridText>
            <GridTitle>{t("bookmarks.item.note")}</GridTitle>
            <GridText>{props.bookmark.note}</GridText>
          </Show>
        </div>
        <CardActions>
          <DeleteBookmarkForm bookmark={props.bookmark} />
          <CompleteDialog bookmark={props.bookmark} />
          <UpdateBookmarkDialog bookmark={props.bookmark} />
          <LinkButton
            onClick={onDetailsClick}
            href={paths.bookmark(props.bookmark.id)}
            size="sm"
            color="secondary"
          >
            <ChevronRightIcon class="size-4" />
            {t("bookmarks.item.details")}
          </LinkButton>
        </CardActions>
      </CardBody>
    </Card>
  );
};

const GridTitle: Component<ParentProps> = (props) => {
  return <span class="font-semibold text-base">{props.children}</span>;
};

const GridText: Component<ParentProps> = (props) => {
  return <span class="break-words">{props.children}</span>;
};

type GridLinkProps = {
  bookmarkId: number;
  href: string;
};

const GridLink: Component<GridLinkProps> = (props) => {
  const isLink = createIsLink(() => props.href);

  const history = useBookmarksHistory();

  const onClick = () => {
    history().addToHistory(props.bookmarkId);
  };

  return (
    <Show when={isLink()} fallback={<GridText>{props.href}</GridText>}>
      <Link
        onClick={onClick}
        hover={true}
        href={props.href}
        class="break-words"
      >
        {props.href}
      </Link>
    </Show>
  );
};

type BookmarkPreviewProps = {
  bookmark: BookmarkWithTagsModel;
};

const BookmarkPreview: Component<BookmarkPreviewProps> = (props) => {
  const images = createMemo(() => {
    const array = props.bookmark.preview
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
      <div class="relative mx-auto my-4 w-64">
        <Carousel>
          <CarouselContent>
            <For each={images()}>
              {(image) => (
                <BookmarkPreviewImage
                  image={image}
                  title={props.bookmark.title}
                />
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

const BookmarkPreviewImage: Component<BookmarkPreviewImageProps> = (props) => {
  const { t } = useI18n();

  let el: HTMLDivElement | undefined;
  const useVisibilityObserver = createVisibilityObserver({ threshold: 0.1 });
  const visible = useVisibilityObserver(() => el);
  const shouldShow = createMemo<boolean>((previous) => previous || visible());

  return (
    <CarouselItem ref={el} class="min-h-72">
      <Show when={shouldShow()}>
        <img
          src={props.image}
          alt={t("bookmarks.item.preview", { preview: props.title })}
          loading="lazy"
          height={250}
          width={250}
          class="h-64 text-base-300"
        />
      </Show>
    </CarouselItem>
  );
};

type BookmarkTagsListProps = {
  bookmark: BookmarkWithTagsModel;
};

const BookmarkTagsList: Component<BookmarkTagsListProps> = (props) => {
  return (
    <ul class="flex flex-row flex-wrap gap-2">
      <For each={props.bookmark.bookmarks_tags}>
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

const BookmarkLinks: Component<BookmarkLinksProps> = (props) => {
  const { t } = useI18n();

  const history = useBookmarksHistory();

  const onClick = () => {
    history().addToHistory(props.bookmark.id);
  };

  const commonProps: Partial<ComponentProps<typeof LinkButton>> = {
    rel: "noopener noreferrer",
    target: "_blank",
    size: "xs",
    color: "secondary",
    onClick,
  };

  return (
    <ul class="flex flex-row flex-wrap gap-2">
      <li>
        <LinkButton
          {...commonProps}
          href={`https://www.youtube.com/results?${new URLSearchParams({ search_query: props.bookmark.title })}`}
        >
          {t("bookmarks.item.youtube")}
        </LinkButton>
      </li>
      <li>
        <LinkButton
          {...commonProps}
          href={`https://www.youtube.com/results?${new URLSearchParams({ q: props.bookmark.title })}`}
        >
          {t("bookmarks.item.google")}
        </LinkButton>
      </li>
      <li>
        <LinkButton
          {...commonProps}
          href={`https://open.spotify.com/search/${props.bookmark.title}`}
        >
          {t("bookmarks.item.spotify")}
        </LinkButton>
      </li>
    </ul>
  );
};
