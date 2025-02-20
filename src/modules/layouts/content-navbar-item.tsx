"use client";
import { NavbarItem } from "@heroui/navbar";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithRef } from "react";

type ContentNavbarItemProps = ComponentPropsWithRef<typeof NavbarItem> & {
	href: string;
};

export const ContentNavbarItem = ({
	href,
	...props
}: ContentNavbarItemProps) => {
	const pathname = usePathname();

	return <NavbarItem {...props} isActive={href === pathname} />;
};
