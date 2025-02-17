import type { AuthError } from "@supabase/supabase-js";
import * as v from "valibot";

export const createRequestError = (): ActionResult => {
	return { error: "Request error", success: false };
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type SuccessResult<T = any> = {
	data: T;
	success: true;
};

export type FailureResult = {
	error?: string;
	errors?: Record<string, string>;
	success: false;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type ActionResult<T = any> = SuccessResult<T> | FailureResult;

export const parseValibotIssues = (
	issues: v.BaseIssue<unknown>[],
): ActionResult => {
	return {
		errors: Object.fromEntries(
			issues.map((issue) => [
				issue.path?.map((item) => item.key).join(".") || "global",
				issue.message,
			]),
		),
		success: false,
	};
};

export const parseAuthError = (error: AuthError): ActionResult => {
	return {
		error: error.message,
		success: false,
	};
};

type HandleActionArgs<
	TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
	THandler extends (args: v.InferOutput<TSchema>) => Promise<ActionResult>,
> = {
	schema: TSchema;
	data: Record<string, unknown>;
	handler: THandler;
};

export const handleAction = async <
	TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
	THandler extends (args: v.InferOutput<TSchema>) => Promise<ActionResult>,
>({
	data,
	handler,
	schema,
}: HandleActionArgs<TSchema, THandler>): Promise<
	Awaited<ReturnType<THandler>>
> => {
	type Result = Awaited<ReturnType<THandler>>;
	const parsed = await v.safeParseAsync(schema, data);

	if (!parsed.success) {
		return parseValibotIssues(parsed.issues) as Result;
	}

	const result = await handler(parsed.output);
	return result as Result;
};
