import { Form } from "@remix-run/react";

export default function GithubLogin() {
  return (
    <Form action="/auth/github" method="post">
      <button>Log in with Github</button>
    </Form>
  );
}
