import { type Component, type ParentProps, createSignal } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
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

export const BookmarkFields: Component<BookmarkFieldsProps> = (props) => {
  const { t } = useI18n();

  const [titleRef, setTitleRef] = createSignal<HTMLInputElement>();
  const [urlRef, setUrlRef] = createSignal<HTMLInputElement>();
  const [previewRef, setPreviewRef] = createSignal<HTMLInputElement>();

  const onCheckSubmit = (data: BookmarkFieldsData) => {
    const titleInput = titleRef();
    const urlInput = urlRef();
    const previewInput = previewRef();

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
    <div class="flex flex-col gap-4">
      <FormError message={props.result?.error} />

      <FormControl>
        <LabelRow>
          <Label for="title">
            <LabelText>{t("bookmarks.form.title")}</LabelText>
          </Label>
          <CheckOgPropsDialog
            value={props.initialData?.title}
            onCheck={onCheckSubmit}
          />
        </LabelRow>
        <TextFieldInput
          id="title"
          name="title"
          placeholder={t("bookmarks.form.title")}
          value={props.initialData?.title}
          disabled={props.pending}
          variant="bordered"
          ref={setTitleRef}
          {...getInvalidStateProps({
            errorMessageId: "title-error",
            isInvalid: !!props.result?.errors?.title,
          })}
        />
        <FieldError id="title-error" message={props.result?.errors?.title} />
      </FormControl>

      <FormControl>
        <LabelRow>
          <Label for="text">
            <LabelText>{t("bookmarks.form.text")}</LabelText>
          </Label>
          <CheckOgPropsDialog
            value={props.initialData?.text}
            onCheck={onCheckSubmit}
          />
        </LabelRow>
        <TextFieldInput
          id="text"
          name="text"
          placeholder={t("bookmarks.form.text")}
          value={props.initialData?.text}
          disabled={props.pending}
          variant="bordered"
          {...getInvalidStateProps({
            errorMessageId: "text-error",
            isInvalid: !!props.result?.errors?.text,
          })}
        />
        <FieldError id="text-error" message={props.result?.errors?.text} />
      </FormControl>

      <FormControl>
        <LabelRow>
          <Label for="url">
            <LabelText>{t("bookmarks.form.url")}</LabelText>
          </Label>
          <CheckOgPropsDialog
            value={props.initialData?.url}
            onCheck={onCheckSubmit}
          />
        </LabelRow>
        <TextFieldInput
          id="url"
          name="url"
          placeholder={t("bookmarks.form.url")}
          value={props.initialData?.url}
          disabled={props.pending}
          variant="bordered"
          ref={setUrlRef}
          {...getInvalidStateProps({
            errorMessageId: "url-error",
            isInvalid: !!props.result?.errors?.url,
          })}
        />
        <FieldError id="url-error" message={props.result?.errors?.url} />
      </FormControl>

      <FormControl>
        <LabelRow>
          <Label for="preview">
            <LabelText>{t("bookmarks.form.preview")}</LabelText>
          </Label>
          <CheckOgPropsDialog
            value={props.initialData?.preview ?? undefined}
            onCheck={onCheckSubmit}
          />
        </LabelRow>
        <TextFieldInput
          id="preview"
          name="preview"
          placeholder={t("bookmarks.form.preview")}
          value={props.initialData?.preview ?? undefined}
          disabled={props.pending}
          variant="bordered"
          ref={setPreviewRef}
          {...getInvalidStateProps({
            errorMessageId: "preview-error",
            isInvalid: !!props.result?.errors?.preview,
          })}
        />
        <FieldError
          id="preview-error"
          message={props.result?.errors?.preview}
        />
      </FormControl>

      <BookmarkTagsField
        disabled={props.pending}
        initialTags={props.initialData?.tags}
      />
    </div>
  );
};

const LabelRow: Component<ParentProps> = (props) => {
  return (
    <div class="flex w-full items-center justify-between gap-2">
      {props.children}
    </div>
  );
};
