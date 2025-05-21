import type { LogpushHttpRequest } from "./logpushHttpRequest";
import { gzipSync } from "fflate";

export interface Env {
	AUTH_TOKEN: string;
}

async function sendToDestination(authToken: string, records: any[]) {
	// your destination endpoint.  we're using http as an example here
	// but you can include other client libraries to use if you want to
	// send to something non http
	const endpoint = "https://foo.bar:8080/"

	// send 5k batches at a time if logpush sends larger batches than your
	// destination can handle.  Set this to the length of `records` if you
	// just want to send the entire thing as is from logpush.
	const batchSize = 5000;

	for (let i = 0; i < records.length; i += batchSize) {
		const batch = records.slice(i, i + batchSize)
		console.log("sample log: " + JSON.stringify(batch[0]))

		// here we are serializing as JSON and formatting as NDJSON files
		// and gzipping.  If your destination wants a differently formatted
		// payload, configure here.
		const jsonPayload = batch.map((x) => JSON.stringify(x)).join("\n")
		const payload = gzipSync(new TextEncoder().encode(jsonPayload))

		try {
			const res = await fetch(endpoint, {
				method: "POST",
				// put credentials here if necessary
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${authToken}`
				},
				body: payload,
			});

			if (!res.ok) {
				console.log(`failed to send to destination (result not ok): ${res.statusText}`);

				// if your destination returned a non successful response, return it directly
				// back to logpush so that logpush can evaluate if the error is retryable and will
				// retry sending back to this worker.  This worker does not have to implement
				// retry logic.
				return res;
			}
		} catch (err) {
			// on non destination related errors, return http status 500.
			console.log(`catch exception, failed to send to splunk (exception): ${err}`);
			return new Response(null, {
				status: 500,
				statusText: `failed to send to splunk: ${err}`,
			});
		}
	}

	// successful push to destination
	return new Response("ok", { status: 200, statusText: "OK" });
}

// transformHttpRequestLog can be used to customize each record of the logpush payload
// that this worker will send to your final destination.
//
// The example function here changes the default logpush http_request record to add a new
// field `env` that says this is a production env.
export function transformHttpRequestLog(x: LogpushHttpRequest) {
	return { ...x, "env": "production" }
}

export default {
	// This is the main entry point for the worker.  Logpush will call
	// this worker to push logpush files.
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		if (request.method !== "POST") {
			return new Response();
		}

		// Logpush sends gzip encoded payloads
		const contentEncoding = request.headers.get("Content-Encoding");
		if (contentEncoding && !contentEncoding.includes("gzip")) {
			return new Response();
		}

		// This worker will have to look at each record in the logpush payload
		// in order to transform it, so we will unzip it first.
		const ds = new DecompressionStream("gzip");
		const decompressed = request.body?.pipeThrough(ds);
		const response = new Response(decompressed);
		const data = await response.text();

		if (data.startsWith(`{"content":"test"}`)) {
			// Logpush initial push payload.  When adding a logpush job with this worker
			// as the destination, logpush will send a test payload to validate that
			// this worker is alive, so we just send back a successful response here.
			console.info("received initial logpush payload");
			return new Response();
		}


		// logpush paylaods are NDJSON, so if you configured your logpush job to
		// use some other format (e.g. CSV using custom formatting feature of logpush),
		// then you will need to do something different here.
		const lines = data.split("\n")

		// Reformat the payload to fit custom needs.  This following block of code is
		// the meat of the worker logic:  for each line, format it to your custom needs,
		// then rebatch the records to be sent to your final destination.
		const batch = lines
			.filter((x) => x)
			.map((x) => JSON.parse(x) as LogpushHttpRequest)
			.map(transformHttpRequestLog);

		// You can put your destination's credentials in a worker's secret environment
		// variable (see https://developers.cloudflare.com/workers/configuration/secrets/).
		// You can create a secret by doing something like:
		// 		npx wrangler secret put AUTH_TOKEN
		// For testing, you can put dev tokens in wrangler.toml.
		const authToken = env.AUTH_TOKEN
		return await sendToDestination(authToken, batch);
	}
} satisfies ExportedHandler<Env>;
