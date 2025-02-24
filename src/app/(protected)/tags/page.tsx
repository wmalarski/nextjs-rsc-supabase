import { getUser } from "@/modules/auth/services";
import { createClient } from "@/modules/supabase/server-action";
import { paths } from "@/utils/paths";
import { redirect } from "next/navigation";

export default async function Tags() {
	const client = await createClient();

	const user = await getUser(client);

	if (!user) {
		redirect(paths.login);
	}

	return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
