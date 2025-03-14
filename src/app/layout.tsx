import { getUser } from "@/modules/auth/services";
import { UserContextProvider } from "@/modules/auth/user-context";
import { createClient } from "@/modules/supabase/server-action";
import { HeroUIProvider } from "@heroui/system";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "./globals.css";

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default async function RootLayout({ children }: PropsWithChildren) {
	const client = await createClient();
	const user = await getUser(client);

	return (
		<UserContextProvider user={user}>
			<html lang="en" className="dark">
				<body className="h-screen">
					<HeroUIProvider>{children}</HeroUIProvider>
				</body>
			</html>
		</UserContextProvider>
	);
}
