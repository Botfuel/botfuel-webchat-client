# Botfuel Webchat Client

Botfuel webchat client designed to work with bots made with Botfuel Bot SDK.
For a more detailed documentation, see https://app.botfuel.io/docs.

We provide a HTTP poll fallback if websockets are not supported by the browser.

## Install

`<script>` tag using CDN

jsDelivr is a global CDN delivery for JavaScript libraries.

To include the latest release:

```html
<script src="https://cdn.jsdelivr.net/npm/botfuel-webchat-client"></script>
```

For older releases:

```html
<script src="https://cdn.jsdelivr.net/npm/botfuel-webchat-client@1.0.0"></script>
```

Then add the following script on your page:

```javascript
BotfuelWebChat.init({
    appToken: '<BOTFUEL_APP_TOKEN>'
});
```

Note: Register and create an app on https://app.botfuel.io to get a `<BOTFUEL_APP_TOKEN>`.

For development, you can also provide a custom backend:

```javascript
BotfuelWebChat.init({
    appToken: '<BOTFUEL_APP_TOKEN>'
    serverUrl: 'http://localhost:7001'
});
```

## Technologies

We mainly use:

- React.js: UI building library
- Syled-components: CSS-in-JS library for styling React UI components
- Apollo: Execute GraphQL queries and subscriptions to the webchat server (https://webchat.botfuel.io).
- Webpack: development and production builds

## Development

To launch a development server, run:

```shell
yarn
yarn start
```

It will launch a webpack dev server.

## Build for production

To build a production optimized for production, run:

```shell
yarn build:production
```

this is useful for testing bundle size or issues that only happen in production.
It is executed by the `npm publish` command (prepublish hook).

## Publishing

To publish package on NPM and jsdelivr, simply bump the version (according to semver) and publish it:

```
npm version <patch, minor, major>
npm publish
```

The script will automatically be available on jsdelivr.

## Useful notes

We use `Fragment` on the payload field in the Message query in the `WebChat/index.jsx` file because it can be of several types: Text, Table, Actions, Postback, Quickreplies, BotAction and Images. The type of payload define which fields are available on it. These types are defined server-side.

In the same file, we use `optimiticResponse` (Apollo) when sending the use message so we immediately update UI with the message sent instead of waiting for the server’s response. This provides a better UI experience where the user can immediately see the message he typed and entered.

## License

See the [LICENSE](LICENSE.md) file.
