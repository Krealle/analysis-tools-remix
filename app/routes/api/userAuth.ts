import { LoaderFunction, json } from "@remix-run/node";

type TokenParams = {
  client_id: string;
  client_secret: string;
  code: string | null;
  redirect_uri: string;
  grant_type: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // Verify state here if needed

  // Exchange the code for an access token
  const tokenEndpoint = "https://www.warcraftlogs.com/oauth/token";
  const tokenParams: TokenParams = {
    client_id: process.env.WCL_CLIENT_ID || "",
    client_secret: process.env.WCL_CLIENT_SECRET || "",
    code: code || null,
    redirect_uri: process.env.REDIRECT_URL || "",
    grant_type: "authorization_code",
  };

  const tokenSearchParams = new URLSearchParams({
    client_id: tokenParams.client_id,
    client_secret: tokenParams.client_secret,
    code: tokenParams.code || "",
    redirect_uri: tokenParams.redirect_uri,
    grant_type: tokenParams.grant_type,
  });

  try {
    const tokenResponse = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenSearchParams.toString(),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Use the accessToken as needed (e.g., store it securely, associate it with the user)

    return json({ message: "Authorization successful!" });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return json({ error: "Error during authorization" }, { status: 500 });
  }
};
