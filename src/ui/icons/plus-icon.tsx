import type { ComponentPropsWithRef } from "react";

export const PlusIcon = (props: ComponentPropsWithRef<"svg">) => {
	return (
		<svg
			fill="none"
			height="24"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</svg>
	);
};
