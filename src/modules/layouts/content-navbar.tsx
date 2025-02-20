import { BookmarkIcon } from "@/ui/icons/bookmark-icon";
import { paths } from "@/utils/paths";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import NextLink from "next/link";

export const ContentNavbar = () => {
	return (
		<Navbar>
			<NavbarBrand>
				<BookmarkIcon />
				<p className="font-bold text-inherit">Bookmarks</p>
			</NavbarBrand>
			<NavbarContent className="hidden gap-4 sm:flex" justify="center">
				<NavbarItem>
					<Link as={NextLink} color="foreground" href={paths.home}>
						Home
					</Link>
				</NavbarItem>
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem className="hidden lg:flex">
					<Link as={NextLink} href={paths.login}>
						Login
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Button as={Link} color="primary" href={paths.signUp} variant="flat">
						Sign Up
					</Button>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
};
