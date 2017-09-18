# Botfuel Webchat Client

Botfuel webchat client designed to work with bots made with Botfuel Bot SDK.
For a more detailed documentation, see https://app.botfuel.io/docs.

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
    applicationId: '<BOTFUEL_APPLICATION_ID'
});
```

Note: Register and create an app on https://app.botfuel.io to get a `<BOTFUEL_APPLICATION_ID>`. 


## Publishing

To publish package on NPM and jsdelivr, simply bump the version (according to semver) and publish it:

```
npm version <patch, minor, major>
npm publish
```

The script will automatically be available on jsdelivr.
