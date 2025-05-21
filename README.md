# logpush-custom-worker-template

This is an example logpush worker with minimal logic (and a lot of commments!) that can be deployed and set as a destination in a logpush job.  This worker's purpose would be to fulfill customizations to the logpush payload not offered natively by Cloudflare logpush.  See [src/index.ts](./src/index.ts) for all the implementation with comments.  See [wrangler.toml](./wrangler.toml) to set your account id as well as some additional configuration.

## Customizing
- First install deps
```sh
npm install # or pnpm install
```
- in wrangler.toml
    - set your account id
    - set your custom domain, or delete the entire routes config if you just want to use the workers.dev domain that gets generated for you

- in src/index.ts
    - update `transformHttpRequest` to do what you want the final payload to your destination to look like
    - update `sendToDestination` to have the logic for authorization for your destination if it's https, or include your own implementation of sending to your destination if it's something non-https.

- testing
    - there are some [basic tests](./test/index.spec.ts) if you want to verify some basics.  The tests depend on the provided example logpush [test payload](./testdata.log.gz)

## Deploying
Set your account id in wrangler.toml and then modify [src/index.ts](./src/index.ts) to do the transformations you need as well as implement the logic to push to your destination.

Then do
```sh
npx wrangler publish
```

## Logpush Job Creation
If you used a custom domain in wrangler.toml, you can use that as the logpush job destination, otherwise you can obtain the worker's dev address from the Cloudflare dashboard and use that.

The relevant parts of the job config would be something like:
```javascript
{
    ...
    "destination_conf": "https://worker_deployment_address/",
    ...
}
```
