import { decode } from "decode-formdata";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import * as v from "valibot";

export const createDoneSchema = () => {
	return v.optional(
		v.union([
			v.literal("all"),
			v.literal("completed"),
			v.literal("uncompleted"),
		]),
		"all",
	);
};

const createRandomSchema = () => {
	return v.optional(
		v.pipe(v.union([v.literal("on"), v.literal("off")])),
		"off",
	);
};

const createQuerySchema = () => {
	return v.optional(v.string());
};

const createFiltersFormSchema = () => {
	return v.object({
		done: createDoneSchema(),
		random: createRandomSchema(),
		query: createQuerySchema(),
		"tags[]": v.optional(v.array(v.number()), []),
	});
};

export const createFiltersSearchParamsSchema = () => {
	return v.object({
		done: createDoneSchema(),
		random: createRandomSchema(),
		query: createQuerySchema(),
		"tags[]": v.optional(
			v.union([
				v.array(v.pipe(v.string(), v.transform(Number))),
				v.pipe(
					v.string(),
					v.transform(Number),
					v.transform((value) => [value]),
				),
			]),
			[],
		),
	});
};

export type FiltersSearchParams = v.InferOutput<
	ReturnType<typeof createFiltersSearchParamsSchema>
>;

type SearchParams = ReturnType<typeof useSearchParams>;

export const parseFiltersSearchParams = (params: SearchParams) => {
	const schema = createFiltersSearchParamsSchema();
	return v.parse(schema, params);
};

export const useFiltersSearchParams = () => {
	const params = useSearchParams();
	return useMemo(() => parseFiltersSearchParams(params), [params]);
};

export const useSetFiltersSearchParams = () => {
	const pathname = usePathname() ?? "/";

	const router = useRouter();

	return (formData: FormData) => {
		const decoded = decode(formData, {
			arrays: ["tags[]"],
			numbers: ["tags[]"],
		});

		const parsed = v.parse(createFiltersFormSchema(), decoded);

		const updatedSearchParams = new URLSearchParams();

		updatedSearchParams.set("done", parsed.done);
		updatedSearchParams.set("random", parsed.random);
		parsed.query && updatedSearchParams.set("query", parsed.query);

		parsed["tags[]"].forEach((value) => {
			updatedSearchParams.append("tags[]", String(value));
		});

		router.push(`${pathname}/?${updatedSearchParams}`);
	};
};
