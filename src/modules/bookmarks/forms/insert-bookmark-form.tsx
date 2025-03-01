import { PlusIcon } from "@/ui/icons/plus-icon";
import { Button } from "@heroui/button";
import { useSubmission } from "@solidjs/router";
import { Card, CardBody } from "~/ui/card/card";
import { cardTitleRecipe } from "~/ui/card/card.recipe";
import { insertBookmarkAction } from "../client";
import { BookmarkFields, type BookmarkFieldsData } from "./bookmark-fields";

type InsertBookmarkFormProps = {
	initialData?: BookmarkFieldsData;
};

export const InsertBookmarkForm = ({
	initialData,
}: InsertBookmarkFormProps) => {
	const submission = useSubmission(insertBookmarkAction);

	return (
		<Card className="mt-4 w-full max-w-md" variant="bordered">
			<CardBody>
				<header className="flex items-center justify-between gap-2">
					<h2 className={cardTitleRecipe()}>Share</h2>
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
						Save
					</Button>
				</form>
			</CardBody>
		</Card>
	);
};
