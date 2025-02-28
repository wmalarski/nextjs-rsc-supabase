import type { Component } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import type { RpcFailure } from "~/modules/common/server/helpers";
import { FieldError } from "~/ui/field-error/field-error";
import { FormControl } from "~/ui/form-control/form-control";
import { FormError } from "~/ui/form-error/form-error";
import { Label, LabelText } from "~/ui/label/label";
import { TextFieldInput } from "~/ui/text-field/text-field";
import { getInvalidStateProps } from "~/ui/utils/get-invalid-state-props";
import type { TagModel } from "../server";

export type TagFieldsData = Pick<TagModel, "name">;

type TagFieldsProps = {
  initialData?: TagFieldsData;
  pending?: boolean;
  result?: RpcFailure;
};

export const TagFields: Component<TagFieldsProps> = (props) => {
  const { t } = useI18n();

  return (
    <div class="flex flex-col gap-4">
      <FormError message={props.result?.error} />

      <FormControl>
        <Label for="name">
          <LabelText>{t("tags.form.name")}</LabelText>
        </Label>
        <TextFieldInput
          id="name"
          name="name"
          placeholder={t("tags.form.name")}
          value={props.initialData?.name}
          disabled={props.pending}
          variant="bordered"
          {...getInvalidStateProps({
            errorMessageId: "name-error",
            isInvalid: !!props.result?.errors?.name,
          })}
        />
        <FieldError id="name-error" message={props.result?.errors?.name} />
      </FormControl>
    </div>
  );
};
