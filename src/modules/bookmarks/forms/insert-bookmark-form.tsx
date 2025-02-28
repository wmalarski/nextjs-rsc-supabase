import { useSubmission } from "@solidjs/router";
import type { Component } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Button } from "~/ui/button/button";
import { Card, CardBody } from "~/ui/card/card";
import { cardTitleRecipe } from "~/ui/card/card.recipe";
import { PlusIcon } from "~/ui/icons/plus-icon";
import { insertBookmarkAction } from "../client";
import { BookmarkFields, type BookmarkFieldsData } from "./bookmark-fields";

type InsertBookmarkFormProps = {
  initialData?: BookmarkFieldsData;
};

export const InsertBookmarkForm: Component<InsertBookmarkFormProps> = (
  props,
) => {
  const { t } = useI18n();

  const submission = useSubmission(insertBookmarkAction);

  return (
    <Card class="mt-4 w-full max-w-md" variant="bordered">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleRecipe()}>{t("bookmarks.share")}</h2>
        </header>
        <form
          action={insertBookmarkAction}
          method="post"
          class="flex flex-col gap-6"
        >
          <BookmarkFields
            initialData={props.initialData}
            pending={submission.pending}
            result={submission.result}
          />
          <Button
            color="primary"
            size="sm"
            type="submit"
            isLoading={submission.pending}
            disabled={submission.pending}
          >
            <PlusIcon class="size-4" />
            {t("common.save")}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
