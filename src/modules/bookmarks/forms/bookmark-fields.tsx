import { type PropsWithChildren, useRef } from "react";
import type { RpcFailure } from "~/modules/common/server/helpers";
import { FieldError } from "~/ui/field-error/field-error";
import { FormControl } from "~/ui/form-control/form-control";
import { FormError } from "~/ui/form-error/form-error";
import { Label, LabelText } from "~/ui/label/label";
import { TextFieldInput } from "~/ui/text-field/text-field";
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
	result?: RpcFailure;
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
				<LabelRow>
					<Label for="title">
						<LabelText>Title</LabelText>
					</Label>
					<CheckOgPropsDialog
						value={initialData?.title}
						onCheck={onCheckSubmit}
					/>
				</LabelRow>
				<TextFieldInput
					id="title"
					name="title"
					placeholder="Title"
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
				<LabelRow>
					<Label for="text">
						<LabelText>Text</LabelText>
					</Label>
					<CheckOgPropsDialog
						value={initialData?.text}
						onCheck={onCheckSubmit}
					/>
				</LabelRow>
				<TextFieldInput
					id="text"
					name="text"
					placeholder="Text"
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
				<LabelRow>
					<Label for="url">
						<LabelText>Url</LabelText>
					</Label>
					<CheckOgPropsDialog
						value={initialData?.url}
						onCheck={onCheckSubmit}
					/>
				</LabelRow>
				<TextFieldInput
					id="url"
					name="url"
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
				<LabelRow>
					<Label for="preview">
						<LabelText>Preview</LabelText>
					</Label>
					<CheckOgPropsDialog
						value={initialData?.preview ?? undefined}
						onCheck={onCheckSubmit}
					/>
				</LabelRow>
				<TextFieldInput
					id="preview"
					name="preview"
					placeholder="Preview"
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

const LabelRow = ({ children }: PropsWithChildren) => {
	return (
		<div className="flex w-full items-center justify-between gap-2">
			{children}
		</div>
	);
};
