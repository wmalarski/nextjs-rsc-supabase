import { getRequiredUser } from "@/modules/auth/services";
import { createClient } from "@/modules/supabase/server-action";

export default async function History() {
	const client = await createClient();
	const user = await getRequiredUser(client);

	return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
