// FASALSATHI Crop.health proxy.
// The Kindwise API key is read only from Supabase Edge Function secrets.
const ALLOWED_ORIGINS = new Set(
  (Deno.env.get("ALLOWED_ORIGINS") ||
    "https://ambkeshwargupta.github.io,http://localhost:8080,http://127.0.0.1:8080")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);

const MAX_IMAGE_BASE64_CHARS = 7_000_000;
const UPSTREAM_TIMEOUT_MS = 45_000;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function corsHeaders(origin: string) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.has(origin)
    ? origin
    : "https://ambkeshwargupta.github.io";
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
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const current = requestBuckets.get(ip);
  if (!current || current.resetAt <= now) {
    requestBuckets.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (current.count >= 12) return false;
  current.count++;
  return true;
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin") ?? "";

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (request.method !== "POST") {
    return jsonResponse({ success: false, error: "method_not_allowed" }, 405, origin);
  }
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return jsonResponse({ success: false, error: "origin_not_allowed" }, 403, origin);
  }

  const providerKey = Deno.env.get("CROP_HEALTH_API_KEY")?.trim();
  const suppliedAppKey = request.headers.get("apikey")?.trim() ?? "";
  const rawPublishableKeys = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") ?? "";
  let expectedAppKey = Deno.env.get("FASALSATHI_PUBLISHABLE_KEY")?.trim() ?? "";
  if (!expectedAppKey && rawPublishableKeys) {
    try {
      const parsed = JSON.parse(rawPublishableKeys);
      expectedAppKey = String(parsed.default ?? Object.values(parsed)[0] ?? "").trim();
    } catch {
      expectedAppKey = "";
    }
  }
  if (!expectedAppKey) expectedAppKey = Deno.env.get("SUPABASE_ANON_KEY")?.trim() ?? "";

  if (!providerKey || !expectedAppKey) {
    return jsonResponse({ success: false, error: "scan_backend_not_configured" }, 503, origin);
  }
  if (!suppliedAppKey || !safeEqual(suppliedAppKey, expectedAppKey)) {
    return jsonResponse({ success: false, error: "invalid_app_key" }, 401, origin);
  }

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(forwarded)) {
    return jsonResponse({ success: false, error: "rate_limit_exceeded" }, 429, origin);
  }

  let payload: { image?: unknown };
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ success: false, error: "invalid_json" }, 400, origin);
  }

  const image = typeof payload.image === "string" ? payload.image.trim() : "";
  if (
    !image ||
    image.length > MAX_IMAGE_BASE64_CHARS ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(image)
  ) {
    return jsonResponse({ success: false, error: "invalid_image" }, 400, origin);
  }

  const upstreamUrl = new URL("https://crop.kindwise.com/api/v1/identification");
  upstreamUrl.searchParams.set(
    "details",
    "taxonomy,description,treatment,symptoms,severity",
  );

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Api-Key": providerKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images: [image] }),
      signal: controller.signal,
    });

    if (upstream.status === 429) {
      return jsonResponse({ success: false, error: "provider_rate_limited" }, 429, origin);
    }
    if (!upstream.ok) {
      const status = upstream.status === 401 || upstream.status === 403 ? 502 : 502;
      console.error("Crop.health upstream returned HTTP", upstream.status);
      return jsonResponse({ success: false, error: "crop_health_upstream_error" }, status, origin);
    }

    let result: unknown;
    try {
      result = await upstream.json();
    } catch {
      return jsonResponse({ success: false, error: "invalid_provider_response" }, 502, origin);
    }

    // Keep the native Crop.health result shape. crop-scan.js parses
    // result.crop.suggestions and result.disease.suggestions.
    return jsonResponse(result, 200, origin);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return jsonResponse({ success: false, error: "crop_health_timeout" }, 504, origin);
    }
    console.error("Crop.health request failed:", error);
    return jsonResponse({ success: false, error: "crop_health_connection_failed" }, 502, origin);
  } finally {
    clearTimeout(timer);
  }
});
