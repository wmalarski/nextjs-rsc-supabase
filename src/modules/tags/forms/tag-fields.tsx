import type { FailureResult } from "@/utils/actions";
import { Input } from "@heroui/input";
import { FieldError } from "~/ui/field-error/field-error";
import { FormControl } from "~/ui/form-control/form-control";
import { FormError } from "~/ui/form-error/form-error";
import { getInvalidStateProps } from "~/ui/utils/get-invalid-state-props";
import type { TagModel } from "../services";

export type TagFieldsData = Pick<TagModel, "name">;

type TagFieldsProps = {
	initialData?: TagFieldsData;
	pending?: boolean;
	result?: FailureResult;
};

export const TagFields = ({ initialData, pending, result }: TagFieldsProps) => {
	return (
		<div className="flex flex-col gap-4">
			<FormError message={result?.error} />

			<FormControl>
				<Input
					id="name"
					name="name"
					placeholder="Name"
					label="Name"
					value={initialData?.name}
					disabled={pending}
					variant="bordered"
					{...getInvalidStateProps({
						errorMessageId: "name-error",
						isInvalid: !!result?.errors?.name,
					})}
				/>
				<FieldError id="name-error" message={result?.errors?.name} />
			</FormControl>
		</div>
	);
};
