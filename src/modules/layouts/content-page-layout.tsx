import type { PropsWithChildren } from "react";
import { ContentNavbar } from "./content-navbar";

export const ContentPageLayout = ({ children }: PropsWithChildren) => {
	return (
		<div>
			<ContentNavbar />
			<main>{children}</main>
		</div>
	);
};
