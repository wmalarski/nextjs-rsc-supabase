import type { PropsWithChildren } from "react";

type FormPageLayoutProps = PropsWithChildren;

export const FormPageLayout = ({ children }: FormPageLayoutProps) => {
	return <main>{children}</main>;
};
