import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { loginAction, signUpAction } from "./actions";

export default function LoginForm() {
	return (
		<main>
			<Form action={loginAction}>
				<Input name="email" type="email" label="Email:" />
				<Input name="password" type="password" label="Password:" />
				<Button type="submit">Log in</Button>
				<Button type="submit" formAction={signUpAction}>
					Sign up
				</Button>
			</Form>
		</main>
	);
}
