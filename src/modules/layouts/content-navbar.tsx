import { BookmarkIcon } from "@/ui/icons/bookmark-icon";
import { paths } from "@/utils/paths";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import NextLink from "next/link";
import { getUser } from "../auth/services";
import { SignOutForm } from "../auth/sign-out-form";
import { createClient } from "../supabase/server-action";
import { ContentNavbarItem } from "./content-navbar-item";

export const ContentNavbar = async () => {
	const client = await createClient();
	const user = await getUser(client);
	const isAuthorized = !!user.data.user;

	return (
		<Navbar>
			<NavbarBrand>
				<BookmarkIcon />
				<p className="font-bold text-inherit">Bookmarks</p>
			</NavbarBrand>
			<NavbarContent className="hidden gap-4 sm:flex" justify="center">
				<ContentNavbarItem href={paths.home}>
					<Link as={NextLink} color="foreground" href={paths.home}>
						Home
					</Link>
				</ContentNavbarItem>
			</NavbarContent>
			{isAuthorized ? <AuthorizedContent /> : <UnauthorizedContent />}
		</Navbar>
	);
};

const AuthorizedContent = () => {
	return (
		<NavbarContent justify="end">
			<ContentNavbarItem href={paths.login} className="hidden lg:flex">
				<Link as={NextLink} href={paths.login}>
					Login
				</Link>
			</ContentNavbarItem>
			<ContentNavbarItem href={paths.signUp}>
				<Button
					as={NextLink}
					color="primary"
					href={paths.signUp}
					variant="flat"
				>
					Sign Up
				</Button>
			</ContentNavbarItem>
		</NavbarContent>
	);
};

const UnauthorizedContent = () => {
	return (
		<NavbarContent justify="end">
			<NavbarItem>
				<SignOutForm />
			</NavbarItem>
		</NavbarContent>
	);
};
