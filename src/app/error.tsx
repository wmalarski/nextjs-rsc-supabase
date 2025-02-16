"use client";

import { useEffect } from "react";

type ErrorPageProps = {
	error: Error;
	reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	useEffect(() => {
		// Log the error to an error reporting service
		/* eslint-disable no-console */
		console.error(error);
	}, [error]);

	return (
		<div>
			<h2>Something went wrong!</h2>
			{/* Attempt to recover by trying to re-render the segment */}
			<button type="button" onClick={() => reset()}>
				Try again
			</button>
		</div>
	);
}
