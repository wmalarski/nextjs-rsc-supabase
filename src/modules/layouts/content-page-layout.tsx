import type { PropsWithChildren } from "react";

type ContentPageLayoutProps = PropsWithChildren;

export const ContentPageLayout = ({ children }: ContentPageLayoutProps) => {
	return <main>{children}</main>;
};
