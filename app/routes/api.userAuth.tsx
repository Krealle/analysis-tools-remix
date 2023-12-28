import { LoaderFunction, json } from "@remix-run/node";
import { redirect } from "react-router-dom";
import crypto from "crypto";
import {
  AccessSession,
  SESSION_DEFAULT_MAX_AGE,
  commitSession,
  getSession,
} from "./sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const receivedState = searchParams.get("state");
  const init = searchParams.has("init");
  const isDev = process.env.NODE_ENV === "development";

  const session = await getSession(request.headers.get("Cookie"));

  if (init && !isDev) {
    const STATE = crypto.randomBytes(32).toString("hex");
    const authorizationUrl = `https://www.warcraftlogs.com/oauth/authorize?client_id=${process.env.WCL_CLIENT_ID}&state=${STATE}&redirect_uri=${process.env.REDIRECT_URL}&response_type=code`;

    session.set("state", STATE);

    return json(
      { authorizationUrl },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }

  if (!code && !isDev) {
    console.error("No code received");
    return redirect("/error?message=No code received from WCL");
  }

  const sessionState = session.get("state");
  if (sessionState !== receivedState && !isDev) {
    console.error("Invalid state received");
    return redirect("/error?message=Invalid state received from WCL");
  }

  // Exchange the code for an access token
  const tokenEndpoint = "https://www.warcraftlogs.com/oauth/token";
  const tokenParams = {
    code: code || null,
    redirect_uri: process.env.REDIRECT_URL || "",
    grant_type: "authorization_code",
  };

  const tokenSearchParams = new URLSearchParams({
    code: tokenParams.code || "",
    redirect_uri: tokenParams.redirect_uri,
    grant_type: tokenParams.grant_type,
  });
  try {
    if (isDev) {
      const devTokenResponse = await fetch(
        "https://www.warcraftlogs.com/oauth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              btoa(
                process.env.WCL_CLIENT_ID + ":" + process.env.WCL_CLIENT_SECRET
              ),
          },
          body: `grant_type=client_credentials`,
        }
      );

      const { access_token, expires_in } = await devTokenResponse.json();

      const accToken: AccessSession = {
        accessToken: access_token,
        expirationTime: Math.round(Date.now() / 1000) + expires_in,
      };

      session.set("accToken", accToken);

      return redirect("/", {
        headers: {
          "set-cookie": await commitSession(session),
        },
      });
    } else {
      const tokenResponse = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            btoa(
              `${process.env.WCL_CLIENT_ID}:${process.env.WCL_CLIENT_SECRET}`
            ),
        },
        body: tokenSearchParams.toString(),
      });

      const tokenData = await tokenResponse.json();

      const accToken: AccessSession = {
        accessToken: tokenData.access_token,
        expirationTime: Math.round(Date.now() / 1000) + SESSION_DEFAULT_MAX_AGE,
      };

      session.set("accToken", accToken);

      return redirect("/", {
        headers: {
          "set-cookie": await commitSession(session),
        },
      });
    }
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return redirect("/error?message=Failed to get authorization from WCL");
  }
};
