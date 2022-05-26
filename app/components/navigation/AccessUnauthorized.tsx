import { Button, Container, Group, Text, Title } from "@mantine/core";
import { NavLink } from "@remix-run/react";

const AccessUnauthorizedPage = () => {
  return (
    <Container className="flex h-screen flex-col items-center justify-center gap-y-8">
      <div className="icon">
        <img
          src="https://www.svgrepo.com/show/28256/warning-sign.svg"
          alt="warning"
          width={64}
          height={64}
        />
      </div>
      <Title>Access denied</Title>
      <Text color="dimmed" size="lg" align="center">
        You are not allowed to access this page. <br /> You may have mistyped
        the address, or got here by mistake. If you think this is an error
        contact support.
      </Text>
      <Group position="center">
        <NavLink to="/">
          <Button size="md" variant="outline" color="indigo">
            Go back home
          </Button>
        </NavLink>
      </Group>
    </Container>
  );
};

export default AccessUnauthorizedPage;
