import { ContentPageLayout } from "@/modules/layouts/content-page-layout";
import type { PropsWithChildren } from "react";

export default function ProtectedLayout({ children }: PropsWithChildren) {
	return <ContentPageLayout>{children}</ContentPageLayout>;
}
