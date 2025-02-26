import { getRequiredUser } from "@/modules/auth/services";
import { BookmarksClient } from "@/modules/bookmarks/bookmarks-client";
import { createClient } from "@/modules/supabase/server-action";

export default async function Home() {
	const client = await createClient();
	const user = await getRequiredUser(client);

	return (
		<div>
			<h2>Server</h2>
			<pre>{JSON.stringify(user, null, 2)}</pre>
			<BookmarksClient />
		</div>
	);
}
