import type { PropsWithChildren } from "react";
import { ContentNavbar } from "./content-navbar";

type FormPageLayoutProps = PropsWithChildren;

export const FormPageLayout = ({ children }: FormPageLayoutProps) => {
	return (
		<div>
			<ContentNavbar />
			<main>{children}</main>
		</div>
	);
};
