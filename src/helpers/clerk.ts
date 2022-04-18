import { getAuth } from "@clerk/remix/ssr.server";
import { User } from "./clerk.types";

/**
 * Get the current Clerk user from the request.
 *
 * @param {Request} Request object
 * @returns {User} User instance
 */
export async function getClerkUser({
  request,
}: {
  request: Request;
}): Promise<User> {
  const { userId } = await getAuth(request);

  const userResp = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_API_KEY}`,
    },
  });
  // @ts-expect-error("ts-type-error")
  const user: User = userResp.json();
  return user;
}
