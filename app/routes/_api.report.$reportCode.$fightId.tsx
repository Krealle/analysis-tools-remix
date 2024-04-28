import { json } from "@remix-run/node";
import { LoaderFunction } from "react-router-dom";

export const loader: LoaderFunction = async ({ params }) => {
  const { reportCode, fightId } = params;

  // await a timer
  await new Promise((resolve) => setTimeout(resolve, 2500));

  return json(
    {
      reportCode,
      fightId,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3000, s-maxage=3000",
        "CDN-Cache-Control": "public, s-maxage=3000",
        "Vercel-CDN-Cache-Control": "public, s-maxage=3000",
      },
    }
  );
};
