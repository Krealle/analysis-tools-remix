type WCLOAuthResponse = {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
};

export const hasValidWCLAuthentication = () => {
  const storedAccessToken = localStorage.getItem("wcl_access_token");
  const storedExpiresIn = localStorage.getItem("wcl_token_expires_in");

  if (!storedAccessToken || !storedExpiresIn) {
    return false;
  } else {
    const expires_in = parseInt(storedExpiresIn, 10);
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    if (expires_in < currentTimeInSeconds) {
      return false;
    }
  }

  return true;
};

/* export const setWCLAuthentication = async (
  authCode: string
): Promise<boolean> => {
  try {
    const response = await axios.post<WCLOAuthResponse>(
      "https://www.warcraftlogs.com/oauth/token",
      {
        redirect_uri: REDIRECT_URL,
        grant_type: "authorization_code",
        code: authCode,
      },
      {
        auth: {
          username: WCL_CLIENT_ID,
          password: WCL_CLIENT_SECRET,
        },
      }
    );

    const { access_token, expires_in } = response.data;
    const actualExpirationTime = Math.round(Date.now() / 1000) + expires_in;

    // FIXME: dont use localStorage
    localStorage.setItem("wcl_access_token", access_token);
    localStorage.setItem(
      "wcl_token_expires_in",
      actualExpirationTime.toString()
    );
    return true;
  } catch (error) {
    console.warn(`Error getting access token: ${error}`);
    return false;
  }
}; */

export const getWCLAuthentication = async (): Promise<string | null> => {
  if (!hasValidWCLAuthentication()) {
    /* await setWCLAuthentication(); */
  }

  const updatedAccessToken = localStorage.getItem("wcl_access_token");
  const updatedExpiresIn = localStorage.getItem("wcl_token_expires_in");

  if (!updatedAccessToken || !updatedExpiresIn) {
    return null;
  }

  return updatedAccessToken;
};
