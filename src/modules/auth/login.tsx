import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useRouter } from "next/router";
import { createClient } from "../supabase/component";

export default function LoginForm() {
	const router = useRouter();
	const supabase = createClient();

	async function logIn() {
		//
	}

	async function signUp() {
		//
	}

	return (
		<main>
			<Form>
				<Input name="email" type="email" label="Email:" />
				<Input name="password" type="password" label="Password:" />
				<Button type="submit" onPress={logIn}>
					Log in
				</Button>
				<Button type="submit" onPress={signUp}>
					Sign up
				</Button>
			</Form>
		</main>
	);
}
