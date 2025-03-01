import type { RpcFailure } from "~/modules/common/server/helpers";
import { Checkbox } from "~/ui/checkbox/checkbox";
import { FieldError } from "~/ui/field-error/field-error";
import { FormControl } from "~/ui/form-control/form-control";
import { FormError } from "~/ui/form-error/form-error";
import { Label, LabelText } from "~/ui/label/label";
import { TextFieldInput } from "~/ui/text-field/text-field";
import { getInvalidStateProps } from "~/ui/utils/get-invalid-state-props";
import type { BookmarkWithTagsModel } from "../services";

type CompleteFieldsProps = {
	initialData?: BookmarkWithTagsModel;
	pending?: boolean;
	result?: RpcFailure;
};

export const CompleteFields = ({
	initialData,
	pending,
	result,
}: CompleteFieldsProps) => {
	return (
		<div className="flex flex-col gap-4">
			<FormError message={result?.error} />

			<FormControl direction="horizontal">
				<Checkbox
					id="done"
					name="done"
					checked={initialData?.done}
					disabled={pending}
					{...getInvalidStateProps({
						errorMessageId: "title-error",
						isInvalid: !!result?.errors?.done,
					})}
				/>
				<Label for="done">
					<LabelText>Done</LabelText>
				</Label>
				<FieldError id="done-error" message={result?.errors?.done} />
			</FormControl>

			<FormControl>
				<Label for="rate">
					<LabelText>Rate</LabelText>
				</Label>
				<TextFieldInput
					id="rate"
					name="rate"
					placeholder="Rate"
					type="number"
					min={0}
					max={10}
					step={0.1}
					value={initialData?.rate ?? 5}
					disabled={pending}
					variant="bordered"
					{...getInvalidStateProps({
						errorMessageId: "rate-error",
						isInvalid: !!result?.errors?.rate,
					})}
				/>
				<FieldError id="text-error" message={result?.errors?.text} />
			</FormControl>

			<FormControl>
				<Label for="note">
					<LabelText>Note</LabelText>
				</Label>
				<TextFieldInput
					id="note"
					name="note"
					placeholder="Note"
					value={initialData?.note ?? ""}
					disabled={pending}
					variant="bordered"
					{...getInvalidStateProps({
						errorMessageId: "note-error",
						isInvalid: !!result?.errors?.note,
					})}
				/>
				<FieldError id="url-note" message={result?.errors?.note} />
			</FormControl>
		</div>
	);
};
