import { HStack, IconButton, Image } from "@chakra-ui/react";
import { LuCircleUserRound } from "react-icons/lu";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { AuthDialog } from "./ui/AuthDialog";
import { ColorModeButton } from "./ui/color-mode";

function Navbar() {
	return (
		<NavigationMenu bg="primary" px={6} py={4} gap={8} align="center" justify="space-between">
			<NavigationMenuItem>
				<Image w="60px" h="50px" src="logo.png"></Image>
			</NavigationMenuItem>
			<NavigationMenuItem flexGrow={1}>
				<HStack gap={8}>
					<NavigationMenuLink href="/" color="white">
						Home
					</NavigationMenuLink>
					<NavigationMenuLink href="tools" color="white">
						Tool Index
					</NavigationMenuLink>
					<NavigationMenuLink href="community" color="white">
						Community
					</NavigationMenuLink>
					<NavigationMenuLink href="mentorship" color="white">
						Mentorship
					</NavigationMenuLink>
					<NavigationMenuLink href="volunteer" color="white">
						Volunteer
					</NavigationMenuLink>
					<NavigationMenuLink href="submission" color="white">
						Tool Submission Form
					</NavigationMenuLink>
				</HStack>
			</NavigationMenuItem>
			<NavigationMenuItem>
				<HStack gap={4}>
					<ColorModeButton color="white"></ColorModeButton>
					<AuthDialog>
						<IconButton bg="primary" _dark={{ bg: "primary", color: "white" }}>
							<LuCircleUserRound />
						</IconButton>
					</AuthDialog>
				</HStack>
			</NavigationMenuItem>
		</NavigationMenu>
	);
}

export default Navbar;
