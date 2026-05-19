import { HStack, IconButton, Image } from "@chakra-ui/react";
import { LuCircleUserRound } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/use-auth";
import { AuthDialog } from "./ui/AuthDialog";
import { ColorModeButton } from "./ui/color-mode";

function Navbar() {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const profileButton = (
		<IconButton
			aria-label={isAuthenticated ? "Account menu" : "Sign in"}
			variant="ghost"
			color="white"
			_hover={{ color: "var(--chakra-colors-contrast)" }}
			onClick={isAuthenticated ? () => navigate("/profile") : undefined}
		>
			<LuCircleUserRound />
		</IconButton>
	);

	return (
		<NavigationMenu bg="primary" px={6} py={4} gap={8} align="center" justify="space-between">
			<NavigationMenuItem>
				<Image w="60px" h="50px" src="/logo.png"></Image>
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
					<ColorModeButton color="white" _hover={{ color: "var(--chakra-colors-contrast)" }} />
					{isAuthenticated ? profileButton : <AuthDialog>{profileButton}</AuthDialog>}
				</HStack>
			</NavigationMenuItem>
		</NavigationMenu>
	);
}

export default Navbar;
