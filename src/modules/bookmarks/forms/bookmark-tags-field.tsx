import { createAsync } from "@solidjs/router";
import { useMemo } from "react";

import { RpcShow } from "~/modules/common/components/rpc-show";
import { selectTagsQuery } from "~/modules/tags/client";
import { Checkbox } from "~/ui/checkbox/checkbox";
import { FormControl } from "~/ui/form-control/form-control";
import { Label, LabelText } from "~/ui/label/label";

export const BOOKMARK_TAGS_FIELD_PREFIX = "tags.";

type BookmarkTagsFieldProps = {
	initialTags?: number[];
	disabled?: boolean;
};

export const BookmarkTagsField = ({
	disabled,
	initialTags,
}: BookmarkTagsFieldProps) => {
	const tags = createAsync(() => selectTagsQuery({}));

	const initialTagIds = useMemo(() => {
		return new Set(initialTags);
	}, [initialTags]);

	return (
		<Suspense>
			<RpcShow result={tags()}>
				{(tags) => (
					<ul>
						<For each={tags().data}>
							{(tag) => {
								const id = `${BOOKMARK_TAGS_FIELD_PREFIX}${tag.id}`;

								return (
									<li>
										<FormControl direction="horizontal">
											<Checkbox
												id={id}
												type="checkbox"
												value={tag.id}
												checked={initialTagIds.has(tag.id)}
												name="tags[]"
												disabled={disabled}
											/>
											<Label for={id}>
												<LabelText>{tag.name}</LabelText>
											</Label>
										</FormControl>
									</li>
								);
							}}
						</For>
					</ul>
				)}
			</RpcShow>
		</Suspense>
	);
};
