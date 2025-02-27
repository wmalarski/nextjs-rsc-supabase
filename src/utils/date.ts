import { useMemo } from "react";

export const createDateFormatter = () => {
	const formatter = useMemo(
		() =>
			new Intl.DateTimeFormat("en", {
				timeStyle: "medium",
				dateStyle: "medium",
				hour12: false,
			}),
		[],
	);
	return (date: string) => formatter.format(new Date(date));
};
