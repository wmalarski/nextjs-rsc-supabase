import { SignOutForm } from "@/modules/auth/sign-out-form";
import { createClient } from "@/modules/supabase/server-action";

export default async function Home() {
	const client = await createClient();

	const user = await client.auth.getUser();

	return (
		<>
			{user ? <SignOutForm /> : null}
			<pre>{JSON.stringify(user, null, 2)}</pre>
		</>
	);
}
