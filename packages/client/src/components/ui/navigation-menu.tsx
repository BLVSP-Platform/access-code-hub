import { Box, BoxProps, Link as ChakraLink, LinkProps, HStack, StackProps } from "@chakra-ui/react"
import { Link as ReactLink } from "react-router-dom";

export const NavigationMenu = (props: StackProps) => {
  const {
    children,
    ...rest
  } = props;

  return <HStack as="nav" w="100%"
    {...rest}>
    {children}
  </HStack>
}

export const NavigationMenuItem = (props: BoxProps) => {
  const {
    children,
    ...rest
  } = props;

  return <Box {...rest}>
    {children}
  </Box>
}

export const NavigationMenuLink = (props: LinkProps) => {
  const {
    children,
    href,
    ...rest
  } = props;

  return <ChakraLink asChild {...rest}>
    <ReactLink to={props.href ?? "#"}>
      {children}
    </ReactLink>
  </ChakraLink>
}