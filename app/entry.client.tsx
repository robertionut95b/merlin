import { ClientProvider } from "@mantine/remix";
import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";
import { cacheAssets } from "remix-utils";

cacheAssets().catch((err) => console.error(err));

hydrate(
  <ClientProvider>
    <RemixBrowser />
  </ClientProvider>,
  document
);
