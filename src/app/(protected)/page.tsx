import { getUser } from "@/modules/auth/services";
import { SignOutForm } from "@/modules/auth/sign-out-form";
import { createClient } from "@/modules/supabase/server-action";
import { paths } from "@/utils/paths";
import { redirect } from "next/navigation";

export default async function Home() {
	const client = await createClient();

	const user = await getUser(client);

	if (!user) {
		redirect(paths.login);
	}

	return (
		<>
			<SignOutForm />
			<pre>{JSON.stringify(user, null, 2)}</pre>
		</>
	);
}
