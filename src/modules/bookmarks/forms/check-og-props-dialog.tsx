import { Button } from "@heroui/button";
import { useState } from "react";
import { createIsLink } from "~/modules/common/utils/create-is-link";
import { getOgPropsQuery } from "../client";
import type { BookmarkFieldsData } from "./bookmark-fields";

type CheckOgPropsDialogProps = {
	value?: string;
	onCheck: (data: BookmarkFieldsData) => void;
};

export const CheckOgPropsDialog = ({
	onCheck,
	value,
}: CheckOgPropsDialogProps) => {
	const isLink = createIsLink(() => value);

	const [isPending, setIsPending] = useState(false);

	const onCheckClick = async () => {
		setIsPending(true);

		const results = await getOgPropsQuery(value);
		const map = new Map(results?.map((prop) => [prop.property, prop.content]));

		const image = map.get("og:image");
		const description = map.get("og:description");
		const url = map.get("og:url");

		onCheck({
			title: description,
			preview: image,
			url,
		});

		setIsPending(false);
	};

	if (!isLink()) {
		return null;
	}

	return (
		<Button
			type="button"
			color="secondary"
			onPress={onCheckClick}
			isLoading={isPending}
			disabled={isPending}
		>
			OG Check
		</Button>
	);
};
