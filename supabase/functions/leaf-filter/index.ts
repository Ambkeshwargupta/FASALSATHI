// FASALSATHI leaf-part preflight using Pl@ntNet automatic organ detection.
// The PlantNet key is stored only in Supabase Function secrets.
const ALLOWED_ORIGINS = new Set(
  (Deno.env.get("ALLOWED_ORIGINS") ||
    "https://ambkeshwargupta.github.io,http://localhost:8080,http://127.0.0.1:8080")
    .split(",").map((value) => value.trim()).filter(Boolean),
);
const MAX_IMAGE_BASE64_CHARS = 1_500_000;
const LEAF_SCORE_THRESHOLD = 0.60;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function corsHeaders(origin: string) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.has(origin)
    ? origin : "https://ambkeshwargupta.github.io";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "apikey, authorization, content-type, x-client-info",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}
function jsonResponse(body: unknown, status: number, origin: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
function resolvePublishableKey() {
  let key = Deno.env.get("FASALSATHI_PUBLISHABLE_KEY")?.trim() ?? "";
  const keys = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") ?? "";
  if (!key && keys) {
    try {
      const parsed = JSON.parse(keys);
      key = String(parsed.default ?? Object.values(parsed)[0] ?? "").trim();
    } catch { key = ""; }
  }
  if (!key) key = Deno.env.get("SUPABASE_ANON_KEY")?.trim() ?? "";
  return key;
}
function checkRateLimit(userId: string) {
  const now = Date.now();
  const current = requestBuckets.get(userId);
  if (!current || current.resetAt <= now) {
    requestBuckets.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (current.count >= 10) return false;
  current.count++;
  return true;
}
function decodeBase64(value: string) {
  const clean = value.replace(/^data:image\/[a-z0-9.+-]+;base64,/i, "");
  if (!clean || clean.length > MAX_IMAGE_BASE64_CHARS ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(clean)) {
    throw new Error("invalid_image");
  }
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin") ?? "";
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (request.method !== "POST") return jsonResponse({ success: false, error: "method_not_allowed" }, 405, origin);
  if (origin && !ALLOWED_ORIGINS.has(origin)) return jsonResponse({ success: false, error: "origin_not_allowed" }, 403, origin);

  const providerKey = Deno.env.get("PLANTNET_API_KEY")?.trim();
  const appKey = resolvePublishableKey();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")?.replace(/\/$/, "");
  if (!providerKey || !appKey || !supabaseUrl) {
    return jsonResponse({ success: false, error: "leaf_filter_not_configured" }, 503, origin);
  }
  const suppliedKey = request.headers.get("apikey")?.trim() ?? "";
  if (!suppliedKey || suppliedKey !== appKey) return jsonResponse({ success: false, error: "invalid_app_key" }, 401, origin);

  const authorization = request.headers.get("authorization") ?? "";
  if (!/^Bearer\s+\S+$/i.test(authorization)) return jsonResponse({ success: false, error: "authentication_required" }, 401, origin);
  let userId = "";
  try {
    const authResponse = await fetch(supabaseUrl + "/auth/v1/user", {
      headers: { apikey: appKey, Authorization: authorization },
    });
    if (!authResponse.ok) return jsonResponse({ success: false, error: "authentication_required" }, 401, origin);
    const user = await authResponse.json();
    userId = typeof user?.id === "string" ? user.id : "";
  } catch {
    return jsonResponse({ success: false, error: "authentication_unavailable" }, 503, origin);
  }
  if (!userId) return jsonResponse({ success: false, error: "authentication_required" }, 401, origin);
  if (!checkRateLimit(userId)) return jsonResponse({ success: false, error: "leaf_filter_rate_limited" }, 429, origin);

  let payload: { image?: unknown };
  try { payload = await request.json(); }
  catch { return jsonResponse({ success: false, error: "invalid_json" }, 400, origin); }
  if (typeof payload.image !== "string") return jsonResponse({ success: false, error: "invalid_image" }, 400, origin);

  let bytes: Uint8Array;
  try { bytes = decodeBase64(payload.image); }
  catch { return jsonResponse({ success: false, error: "invalid_image" }, 400, origin); }

  const form = new FormData();
  form.append("images", new Blob([bytes], { type: "image/jpeg" }), "fasalsathi-leaf-check.jpg");
  form.append("organs", "auto");

  const url = new URL("https://my-api.plantnet.org/v2/identify/all");
  url.searchParams.set("api-key", providerKey);
  url.searchParams.set("lang", "en");
  url.searchParams.set("nb-results", "1");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    const upstream = await fetch(url, { method: "POST", body: form, signal: controller.signal });
    if (upstream.status === 404) {
      return jsonResponse({ success: true, accepted: false, organ: "not_plant", score: null, reason: "not_plant" }, 200, origin);
    }
    if (upstream.status === 429) return jsonResponse({ success: false, error: "leaf_filter_quota_exceeded" }, 429, origin);
    if (!upstream.ok) {
      console.error("Pl@ntNet organ preflight returned HTTP", upstream.status);
      return jsonResponse({ success: false, error: "leaf_filter_upstream_error" }, 502, origin);
    }
    let result: any;
    try { result = await upstream.json(); }
    catch { return jsonResponse({ success: false, error: "leaf_filter_invalid_response" }, 502, origin); }

    const predicted = Array.isArray(result?.predictedOrgans) ? result.predictedOrgans[0] : null;
    const organ = typeof predicted?.organ === "string" ? predicted.organ.toLowerCase() : "unknown";
    const score = typeof predicted?.score === "number" && Number.isFinite(predicted.score) &&
      predicted.score >= 0 && predicted.score <= 1 ? predicted.score : null;
    const accepted = organ === "leaf" && score !== null && score >= LEAF_SCORE_THRESHOLD;
    const reason = accepted ? "leaf_confirmed" : organ === "leaf" || organ === "unknown" ? "uncertain" : "wrong_part";

    return jsonResponse({
      success: true,
      accepted,
      organ,
      score,
      threshold: LEAF_SCORE_THRESHOLD,
      reason,
      modelVersion: typeof result?.version === "string" ? result.version : null,
      remainingRequests: Number.isInteger(result?.remainingIdentificationRequests) ? result.remainingIdentificationRequests : null,
    }, 200, origin);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return jsonResponse({ success: false, error: "leaf_filter_timeout" }, 504, origin);
    console.error("Pl@ntNet leaf preflight failed:", error);
    return jsonResponse({ success: false, error: "leaf_filter_connection_failed" }, 502, origin);
  } finally {
    clearTimeout(timer);
  }
});
