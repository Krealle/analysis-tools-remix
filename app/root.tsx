import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@vercel/remix";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./styles/fonts.css";
import "./styles/App.css";
import "./styles/classColors.css";
// eslint-disable-next-line node/no-missing-import
import { SpeedInsights } from "@vercel/speed-insights/remix";
// eslint-disable-next-line node/no-missing-import
import { Analytics } from "@vercel/analytics/react";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link rel="icon" type="image/svg+xml" href="/static/bear/uwu-256.png" />
      </head>
      <body>
        <SpeedInsights />
        <Analytics />
        <div id="root">
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </div>
      </body>
    </html>
  );
}
