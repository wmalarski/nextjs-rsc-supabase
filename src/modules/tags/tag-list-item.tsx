import { createDateFormatter } from "@/utils/date";
import { Card, CardBody, CardFooter } from "@heroui/card";
import type { TagModel } from "./services";

type TagsListItemProps = {
	tag: TagModel;
};

export const TagsListItem = ({ tag }: TagsListItemProps) => {
	const formatDate = createDateFormatter();

	return (
		<Card>
			<CardBody className="flex flex-col gap-2">
				<div className="flex flex-grow flex-col gap-2 pr-6">
					<span className="text-lg">{tag.name}</span>
					<span>{formatDate(tag.created_at)}</span>
				</div>
				<CardFooter>
					<UpdateTagDialog tag={tag} />
					<DeleteTagForm tag={tag} />
				</CardFooter>
			</CardBody>
		</Card>
	);
};
