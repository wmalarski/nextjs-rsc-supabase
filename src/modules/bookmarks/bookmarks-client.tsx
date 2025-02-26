"use client";

import { useRequiredUserContext } from "../auth/user-context";

export const BookmarksClient = () => {
	const user = useRequiredUserContext();

	return (
		<div>
			<h2>Client</h2>
			<pre>{JSON.stringify(user, null, 2)}</pre>
		</div>
	);
};
