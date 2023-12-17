/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  optimize: {
    bundle: {
      external: {
        include: ["./public/fonts/**/*"],
      },
    },
  } /* 
  routes: {
    "/": require.resolve("routes/_index"),
  }, */,
};
