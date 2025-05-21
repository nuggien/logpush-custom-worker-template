// test/index.spec.ts
import { SELF } from "cloudflare:test";
import { gzipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { transformHttpRequestLog } from "../src";

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Create Logpush Job", () => {
	it("responds with ok to test payload", async () => {
		const response = await SELF.fetch("https://example.com", {
			method: "POST",
			body: gzipSync(new TextEncoder().encode(`{"content":"test"}`)),
			headers: {
				"Content-Type": "application/json",
				"Content-Encoding": "gzip",
			},
		});
		expect(response.status).toBe(200);
		expect(await response.text()).toMatchInlineSnapshot(`""`);
	});
});

describe("Should format Logpush output", () => {
	it("formats a batch", async () => {
		const data = `{"CacheCacheStatus":"dynamic","CacheReserveUsed":false,"CacheResponseBytes":5055,"CacheResponseStatus":200,"CacheTieredFill":false,"ClientASN":63949,"ClientCountry":"au","ClientDeviceType":"desktop","ClientIP":"194.195.253.111","ClientIPClass":"monitoringService","ClientMTLSAuthCertFingerprint":"","ClientMTLSAuthStatus":"unknown","ClientRegionCode":"NSW","ClientRequestBytes":4021,"ClientRequestHost":"mirio.dev","ClientRequestMethod":"GET","ClientRequestPath":"/","ClientRequestProtocol":"HTTP/2","ClientRequestReferer":"","ClientRequestScheme":"https","ClientRequestSource":"eyeball","ClientRequestURI":"/","ClientRequestUserAgent":"Better Uptime Bot Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36","ClientSSLCipher":"AEAD-AES256-GCM-SHA384","ClientSSLProtocol":"TLSv1.3","ClientSrcPort":60834,"ClientTCPRTTMs":1,"ClientXRequestedWith":"","ContentScanObjResults":[],"ContentScanObjSizes":[],"ContentScanObjTypes":[],"Cookies":{},"EdgeCFConnectingO2O":false,"EdgeColoCode":"SYD","EdgeColoID":492,"EdgeEndTimestamp":"2024-12-04T00:36:43Z","EdgePathingOp":"wl","EdgePathingSrc":"macro","EdgePathingStatus":"mon","EdgeRequestHost":"mirio.dev","EdgeResponseBodyBytes":2766,"EdgeResponseBytes":3930,"EdgeResponseCompressionRatio":3.1,"EdgeResponseContentType":"text/html; charset=utf-8","EdgeResponseStatus":200,"EdgeServerIP":"","EdgeStartTimestamp":"2024-12-04T00:36:43Z","EdgeTimeToFirstByteMs":53,"LeakedCredentialCheckResult":"none","OriginDNSResponseTimeMs":2,"OriginIP":"","OriginRequestHeaderSendDurationMs":0,"OriginResponseBytes":0,"OriginResponseDurationMs":35,"OriginResponseHTTPExpires":"","OriginResponseHTTPLastModified":"","OriginResponseHeaderReceiveDurationMs":35,"OriginResponseStatus":200,"OriginResponseTime":35000000,"OriginSSLProtocol":"none","OriginTCPHandshakeDurationMs":0,"OriginTLSHandshakeDurationMs":0,"ParentRayID":"00","RayID":"8ec7b94c9b18a95c","RequestHeaders":{},"ResponseHeaders":{},"SecurityAction":"","SecurityActions":[],"SecurityRuleDescription":"","SecurityRuleID":"","SecurityRuleIDs":[],"SecuritySources":[],"SmartRouteColoID":0,"UpperTierColoID":0,"WAFAttackScore":82,"WAFFlags":"0","WAFMatchedVar":"","WAFRCEAttackScore":86,"WAFSQLiAttackScore":96,"WAFXSSAttackScore":97,"WorkerCPUTime":0,"WorkerStatus":"unknown","WorkerSubrequest":false,"WorkerSubrequestCount":0,"WorkerWallTimeUs":0,"ZoneName":"mirio.dev","ClientLongitude":"151.20060","ClientLatitude":"-33.87150","ClientCity":"Sydney"}`;
		const input = JSON.parse(data);
		const transformed = transformHttpRequestLog(input);

		// expect that the output contains the additional field we added.
		const expected = {...input, "env":"production"}
		expect(transformed).toEqual(expected)
	});
});
