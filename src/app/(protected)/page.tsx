import { createClient } from "@/modules/supabase/server-action";

export default async function Home() {
	const client = await createClient();

	const user = await client.auth.getUser();

	return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
