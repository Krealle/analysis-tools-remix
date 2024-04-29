import { json } from "@remix-run/node";
import { LoaderFunction } from "react-router-dom";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { reportCode, fightId } = params;
  const header = request.headers;

  console.info(header);

  // await a timer
  await new Promise((resolve) => setTimeout(resolve, 100));

  return json(
    {
      reportCode,
      fightId,
      region: process.env.VERCEL_REGION,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=3000",
        "CDN-Cache-Control": "public, s-maxage=3000",
        "Vercel-CDN-Cache-Control": "public, s-maxage=3000",
      },
    }
  );
};
