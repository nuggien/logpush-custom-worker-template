
// http_requests fields from https://developers.cloudflare.com/logs/reference/log-fields/zone/http_requests/
// If you use a different dataset, you can copy fields into a new interface to use if you care about
// typescript type safety.
export interface LogpushHttpRequest {
	BotScore?: number;
	BotScoreSrc?: string;
	BotTags?: string[];
	CacheCacheStatus?: string;
	CacheResponseBytes?: number;
	CacheTieredFill?: boolean;
	ClientASN?: number;
	ClientCity?: string;
	ClientCountry?: string;
	ClientDeviceType?: string;
	ClientIP?: string;
	ClientLatitude?: string;
	ClientLongitude?: string;
	ClientMTLSAuthStatus?: string;
	ClientRegionCode?: string;
	ClientRequestBytes?: number;
	ClientRequestHost?: string;
	ClientRequestMethod?: string;
	ClientRequestPath?: string;
	ClientRequestProtocol?: string;
	ClientRequestReferer?: string;
	ClientRequestScheme?: string;
	ClientRequestSource?: string;
	ClientRequestURI?: string;
	ClientRequestUserAgent?: string;
	ClientSSLCipher?: string;
	ClientSSLProtocol?: string;
	ClientSrcPort?: number;
	ClientTCPRTTMs?: number;
	ClientXRequestedWith?: string;
	Cookies?: Cookies;
	EdgeCFConnectingO2O?: boolean;
	EdgeColoCode?: string;
	EdgeColoID?: number;
	EdgeEndTimestamp?: string | number;
	EdgeResponseBodyBytes?: number;
	EdgeResponseBytes?: number;
	EdgeResponseContentType?: string;
	EdgeResponseStatus?: number;
	EdgeServerIP?: string;
	EdgeStartTimestamp?: string | number;
	EdgeTimeToFirstByteMs?: number;
	JA3Hash?: string;
	JA4?: string;
	OriginDNSResponseTimeMs?: number;
	OriginIP?: string;
	OriginRequestHeaderSendDurationMs?: number;
	OriginResponseDurationMs?: number;
	OriginResponseHTTPExpires?: string;
	OriginResponseHTTPLastModified?: string;
	OriginResponseHeaderReceiveDurationMs?: number;
	OriginResponseStatus?: number;
	OriginSSLProtocol?: string;
	OriginTCPHandshakeDurationMs?: number;
	OriginTLSHandshakeDurationMs?: number;
	ParentRayID?: string;
	RayID?: string;
	RequestHeaders?: Headers;
	ResponseFields?: ResponseFields;
	ResponseHeaders?: Headers;
	SecurityAction?: string;
	SecurityActions?: string[];
	SecurityLevel?: string;
	SecurityRuleDescription?: string;
	SecurityRuleID?: string;
	SecurityRuleIDs?: string[];
	SecuritySources?: string[];
	SmartRouteColoID?: number;
	UpperTierColoID?: number;
	WAFAttackScore?: number;
	WorkerStatus?: string;
	WorkerSubrequest?: boolean;
	WorkerSubrequestCount?: number;
	sampleInterval?: number;
}


// The following are for custom fields usage:  https://developers.cloudflare.com/logs/reference/custom-fields/
interface Cookies {
	[key: string]: string;
}

interface Headers {
	[key: string]: string;
}

interface ResponseFields {
	[key: string]: string[];
}
