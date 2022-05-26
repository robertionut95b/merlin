import type { User } from "@prisma/client";
import { renderToString } from "react-dom/server";
import type { SendEmailFunction } from "remix-auth-email-link";
import { smtp } from "./email-provider.server";

export let sendEmail: SendEmailFunction<User> = async (options) => {
  let subject = "Here's your Magic sign-in link";
  let body = renderToString(
    <p>
      Hi {options.user?.email},<br />
      <br />
      <a href={options.magicLink}>Click here to login on Merlin</a>
    </p>
  );

  await smtp.sendEmail({ emailAddress: options.emailAddress }, subject, body);
};
