import { FormPageLayout } from "@/modules/layouts/form-page-layout";
import type { PropsWithChildren } from "react";

export default function ProtectedLayout({ children }: PropsWithChildren) {
	return <FormPageLayout>{children}</FormPageLayout>;
}
