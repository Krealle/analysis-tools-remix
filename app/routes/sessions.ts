import { createCookieSessionStorage } from "@vercel/remix";

export type AccessSession = {
  accessToken: string;
  expirationTime: number;
};

/** 30 Days */
export const SESSION_DEFAULT_MAX_AGE = 60 * 60 * 24 * 30;

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
