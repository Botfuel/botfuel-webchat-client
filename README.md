# Botfuel Webchat Client

Botfuel webchat client designed to work with bots made with Botfuel Bot SDK.
For a more detailed documentation, see https://app.botfuel.io/docs.

## Install

<script> tag using CDN

jsDelivr is a global CDN delivery for JavaScript libraries.

To include the latest release:

<script src="https://cdn.jsdelivr.net/npm/botfuel-webchat-client"></script>

For older releases:

<script src="https://cdn.jsdelivr.net/npm/botfuel-webchat-client@1.0.0"></script>

Then add the following script on your page:

```
BotfuelWebChat.init({
    applicationId: '<BOTFUEL_APPLICATION_ID'
});
```

Note: Register and create an app on https://app.botfuel.io to get a `<BOTFUEL_APPLICATION_ID>`. 
