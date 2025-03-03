import type { FailureResult } from "@/utils/actions";
import { Input } from "@heroui/input";
import { useRef } from "react";
import { FieldError } from "~/ui/field-error/field-error";
import { FormControl } from "~/ui/form-control/form-control";
import { FormError } from "~/ui/form-error/form-error";
import { getInvalidStateProps } from "~/ui/utils/get-invalid-state-props";
import { BookmarkTagsField } from "./bookmark-tags-field";
import { CheckOgPropsDialog } from "./check-og-props-dialog";

export type BookmarkFieldsData = {
	title?: string;
	text?: string;
	url?: string;
	preview?: string | null;
	tags?: number[];
};

type BookmarkFieldsProps = {
	initialData?: BookmarkFieldsData;
	pending?: boolean;
	result?: FailureResult;
};

export const BookmarkFields = ({
	initialData,
	pending,
	result,
}: BookmarkFieldsProps) => {
	const titleRef = useRef<HTMLInputElement>(null);
	const urlRef = useRef<HTMLInputElement>(null);
	const previewRef = useRef<HTMLInputElement>(null);

	const onCheckSubmit = (data: BookmarkFieldsData) => {
		const titleInput = titleRef.current;
		const urlInput = urlRef.current;
		const previewInput = previewRef.current;

		if (data.title && titleInput) {
			titleInput.value = data.title;
		}
		if (data.url && urlInput) {
			urlInput.value = data.url;
		}
		if (data.preview && previewInput) {
			previewInput.value = data.preview;
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<FormError message={result?.error} />

			<FormControl>
				<CheckOgPropsDialog
					value={initialData?.title}
					onCheck={onCheckSubmit}
				/>
				<Input
					id="title"
					name="title"
					placeholder="Title"
					label="Title"
					value={initialData?.title}
					disabled={pending}
					variant="bordered"
					ref={titleRef}
					{...getInvalidStateProps({
						errorMessageId: "title-error",
						isInvalid: !!result?.errors?.title,
					})}
				/>
				<FieldError id="title-error" message={result?.errors?.title} />
			</FormControl>

			<FormControl>
				<CheckOgPropsDialog value={initialData?.text} onCheck={onCheckSubmit} />
				<Input
					id="text"
					name="text"
					placeholder="Text"
					label="Text"
					value={initialData?.text}
					disabled={pending}
					variant="bordered"
					{...getInvalidStateProps({
						errorMessageId: "text-error",
						isInvalid: !!result?.errors?.text,
					})}
				/>
				<FieldError id="text-error" message={result?.errors?.text} />
			</FormControl>

			<FormControl>
				<CheckOgPropsDialog value={initialData?.url} onCheck={onCheckSubmit} />
				<Input
					id="url"
					name="url"
					label="Url"
					placeholder="Url"
					value={initialData?.url}
					disabled={pending}
					variant="bordered"
					ref={urlRef}
					{...getInvalidStateProps({
						errorMessageId: "url-error",
						isInvalid: !!result?.errors?.url,
					})}
				/>
				<FieldError id="url-error" message={result?.errors?.url} />
			</FormControl>

			<FormControl>
				<CheckOgPropsDialog
					value={initialData?.preview ?? undefined}
					onCheck={onCheckSubmit}
				/>
				<Input
					id="preview"
					name="preview"
					placeholder="Preview"
					label="Preview"
					value={initialData?.preview ?? undefined}
					disabled={pending}
					variant="bordered"
					ref={previewRef}
					{...getInvalidStateProps({
						errorMessageId: "preview-error",
						isInvalid: !!result?.errors?.preview,
					})}
				/>
				<FieldError id="preview-error" message={result?.errors?.preview} />
			</FormControl>

			<BookmarkTagsField disabled={pending} initialTags={initialData?.tags} />
		</div>
	);
};
