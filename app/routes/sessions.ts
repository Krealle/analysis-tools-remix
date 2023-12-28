import { createCookieSessionStorage } from "@remix-run/node";

export type AccessSession = {
  accessToken: string;
  expirationTime: number;
};

/** 24 Hours */
export const SESSION_DEFAULT_MAX_AGE = 60 * 60 * 24;

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      secure: process.env.NODE_ENV !== "development" ? true : false,
      secrets: [process.env.SESSION_SECRET!],
      sameSite: "lax",
      httpOnly: true,
      maxAge: SESSION_DEFAULT_MAX_AGE,
    },
  });

export { getSession, commitSession, destroySession };
