import {
  Anchor,
  Button,
  Center,
  Checkbox,
  Divider,
  Group,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { NavLink } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import {
  FacebookSvg,
  GithubSvg,
  GoogleSvg,
} from "~/components/react-icons/SvgIcons";
import { PasswordInput } from "~/components/validated-form/PasswordInput";
import { SubmitButton } from "~/components/validated-form/SubmitButton";
import { TextInput } from "~/components/validated-form/TextInput";
import { authenticator } from "~/services/auth/auth.server";

const model = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const validator = withZod(zfd.formData(model));

export const loader: LoaderFunction = ({ request }) => {
  return authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
};

export const action: ActionFunction = ({ request, context }) => {
  return authenticator.authenticate("user-pass", request, {
    successRedirect: "/app",
    throwOnError: true,
    context,
  });
};

const LoginPage = () => {
  return (
    <Center className="flex h-screen flex-col">
      <ValidatedForm
        id="login-form"
        method="post"
        className="mx-auto flex w-full flex-col gap-y-2 md:w-1/2 lg:w-1/3"
        validator={validator}
      >
        <img
          className="h-16 w-auto"
          src="/images/popcorn-logo.svg"
          alt="Workflow"
        />
        <Title align="center">Merlin Log-in</Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor<"a">
            href="#"
            size="sm"
            onClick={(event) => event.preventDefault()}
          >
            Create account
          </Anchor>
        </Text>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <h4 className="mb-2 text-center text-lg font-semibold">
            Sign-in using
          </h4>
          <Group grow className="flex">
            <Button variant="outline" leftIcon={<GithubSvg />}>
              <NavLink to="/login/github">Github login</NavLink>
            </Button>
            <Button variant="outline" leftIcon={<GoogleSvg />}>
              Google login
            </Button>
            <Button variant="outline" leftIcon={<FacebookSvg />}>
              Facebook login
            </Button>
          </Group>
          <Divider className="my-4" label="OR" labelPosition="center" />
          <TextInput
            type="email"
            label="Email"
            placeholder="john.doe@merlin.org"
            name="email"
            required
          />
          <PasswordInput
            label="Password"
            placeholder="secret"
            type="password"
            name="password"
            required
            mt="md"
          />
          <Group position="apart" mt="md">
            <Checkbox label="Remember me" />
            <Anchor<"a">
              onClick={(event) => event.preventDefault()}
              href="#"
              size="sm"
            >
              Forgot password?
            </Anchor>
          </Group>
          <SubmitButton
            className="mt-4 w-full"
            type={"submit"}
            variant="outline"
            color="indigo"
            label={"Log in"}
          />
        </Paper>
      </ValidatedForm>
    </Center>
  );
};

export default LoginPage;

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{error.message}</p>
    </div>
  );
}
