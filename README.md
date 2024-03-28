# Welcome to Remix!

- [Remix Docs](https://reminpx.run/docs)

## Development

To start off you need to set the Environment Variables. Copy the `.env.example` file in the project root, and name it `.env`. Then insert your own WCL V2 client secret/id. To get these you need to login into Warcraft Logs and go to [Mange Your Clients](https://www.warcraftlogs.com/api/clients/) under your profile and create a client. The redirect url you set in your client should be the same as the one set in `.env`.

`SESSION_SECRET` can be set to anything you like, it is only used internally to verify that requests are made from us.

Next you need to install node modules:

```sh
npm install
```

Then you can start your app in development mode:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes. The app will be available at [http://localhost:3000/](http://localhost:3000/).

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
