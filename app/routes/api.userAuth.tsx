import { LoaderFunction, json } from "@remix-run/node";
import { redirect } from "react-router-dom";

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // Verify state here if needed

  if (!code) {
    // Include a state for security (optional)
    const STATE = "XephIsCute";
    const authorizationUrl = `https://www.warcraftlogs.com/oauth/authorize?client_id=${process.env.WCL_CLIENT_ID}&state=${STATE}&redirect_uri=${process.env.REDIRECT_URL}&response_type=code`;

    // Redirect the user to the authorization URL
    return {
      status: 302, // 302 Found (Temporary Redirect)
      headers: {
        Location: authorizationUrl,
      },
    };
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
    const tokenResponse = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          btoa(`${process.env.WCL_CLIENT_ID}:${process.env.WCL_CLIENT_SECRET}`),
      },
      body: tokenSearchParams.toString(),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const cookieOptions = {
      maxAge: 60 * 60,
      httpOnly: true,
    };

    const cookieHeader = `accessToken=${accessToken}; ${Object.entries(
      cookieOptions
    )
      .map(([key, value]) => `${key}=${value}`)
      .join("; ")}`;

    return redirect("/", { headers: { "set-cookie": cookieHeader } });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return json({ error: "Error during authorization" }, { status: 500 });
  }
};
