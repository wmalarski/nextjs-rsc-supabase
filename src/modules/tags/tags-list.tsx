import type { TagModel } from "./services";
import { TagsListItem } from "./tag-list-item";

type TagsListProps = {
	tags: TagModel[];
};

export const TagsList = ({ tags }: TagsListProps) => {
	return (
		<ul className="flex flex-col gap-2">
			{tags.map((tag) => (
				<li key={tag.id}>
					<TagsListItem tag={tag} />
				</li>
			))}
		</ul>
	);
};
