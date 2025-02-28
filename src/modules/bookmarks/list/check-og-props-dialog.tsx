import { type Component, Show, createSignal } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import { createIsLink } from "~/modules/common/utils/create-is-link";
import { Button } from "~/ui/button/button";
import { getOgPropsQuery } from "../client";
import type { BookmarkFieldsData } from "./bookmark-fields";

type CheckOgPropsDialogProps = {
  value?: string;
  onCheck: (data: BookmarkFieldsData) => void;
};

export const CheckOgPropsDialog: Component<CheckOgPropsDialogProps> = (
  props,
) => {
  const { t } = useI18n();

  const isLink = createIsLink(() => props.value);

  const [isPending, setIsPending] = createSignal(false);

  const onCheckClick = async () => {
    setIsPending(true);

    const results = await getOgPropsQuery(props.value);
    const map = new Map(
      results?.props.map((prop) => [prop.property, prop.content]),
    );

    const image = map.get("og:image");
    const description = map.get("og:description");
    const url = map.get("og:url");

    props.onCheck({
      title: description,
      preview: image,
      url,
    });

    setIsPending(false);
  };

  return (
    <Show when={isLink()}>
      <Button
        type="button"
        color="secondary"
        size="xs"
        onClick={onCheckClick}
        isLoading={isPending()}
        disabled={isPending()}
      >
        {t("bookmarks.form.check")}
      </Button>
    </Show>
  );
};
