import { useSubmission } from "@solidjs/router";
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

export const InsertBookmarkForm = ({
	initialData,
}: InsertBookmarkFormProps) => {
	const { t } = useI18n();

	const submission = useSubmission(insertBookmarkAction);

	return (
		<Card className="mt-4 w-full max-w-md" variant="bordered">
			<CardBody>
				<header className="flex items-center justify-between gap-2">
					<h2 className={cardTitleRecipe()}>{t("bookmarks.share")}</h2>
				</header>
				<form
					action={insertBookmarkAction}
					method="post"
					className="flex flex-col gap-6"
				>
					<BookmarkFields
						initialData={initialData}
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
						<PlusIcon className="size-4" />
						{t("common.save")}
					</Button>
				</form>
			</CardBody>
		</Card>
	);
};
