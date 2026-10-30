// Anonymous crop-report relay for FASALSATHI.
// The public browser key is checked, but database access stays server-side.
// The table has RLS enabled and no anon/authenticated policies.
const ALLOWED_ORIGINS = new Set(
  (Deno.env.get("ALLOWED_ORIGINS") ||
    "https://ambkeshwargupta.github.io,http://localhost:8080,http://127.0.0.1:8080")
    .split(",").map((v) => v.trim()).filter(Boolean),
);
const MAX_FIELDS = 10;
const MAX_REPORTS_PER_FIELD = 100;
const RATE_LIMIT = 30;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function keyFromEnv(name: string): string {
  const raw = Deno.env.get(name);
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      const value = parsed.default ?? Object.values(parsed)[0];
      return typeof value === "string" ? value.trim() : "";
    }
  } catch {
    return raw.trim();
  }
  return "";
}

const SUPABASE_URL = (Deno.env.get("SUPABASE_URL") ?? "").replace(/\/$/, "");
const SERVICE_KEY =
  keyFromEnv("SUPABASE_SECRET_KEYS") ||
  (Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "").trim();
const PUBLISHABLE_KEY =
  keyFromEnv("SUPABASE_PUBLISHABLE_KEYS") ||
  (Deno.env.get("SUPABASE_ANON_KEY") ?? "").trim();

function cors(origin: string) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin)
    ? origin
    : "https://ambkeshwargupta.github.io";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "apikey, authorization, content-type, x-client-info",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}
function reply(body: unknown, status: number, origin: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(origin), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
function safeEqual(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}
function rateAllowed(ip: string) {
  const now = Date.now();
  const item = requestBuckets.get(ip);
  if (!item || item.resetAt <= now) {
    requestBuckets.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (item.count >= RATE_LIMIT) return false;
  item.count++;
  return true;
}
function distanceKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const rad = (v: number) => v * Math.PI / 180;
  const dLat = rad(bLat - aLat), dLon = rad(bLon - aLon);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}
function validPoint(value: unknown): value is { latitude: number; longitude: number } {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return typeof p.latitude === "number" && Number.isFinite(p.latitude) &&
    p.latitude >= -90 && p.latitude <= 90 &&
    typeof p.longitude === "number" && Number.isFinite(p.longitude) &&
    p.longitude >= -180 && p.longitude <= 180;
}
async function dbRequest(path: string, init: RequestInit = {}) {
  const response = await fetch(SUPABASE_URL + "/rest/v1/" + path, {
    ...init,
    headers: {
      "apikey": SERVICE_KEY,
      "Authorization": "Bearer " + SERVICE_KEY,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    console.error("Disease reports database request failed:", response.status, text.slice(0, 500));
    throw new Error("reports_database_error");
  }
  if (!text) return null;
  try { return JSON.parse(text); } catch { throw new Error("reports_invalid_database_response"); }
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin") ?? "";
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (request.method !== "POST") return reply({ error: "method_not_allowed" }, 405, origin);
  if (origin && !ALLOWED_ORIGINS.has(origin)) return reply({ error: "origin_not_allowed" }, 403, origin);
  if (!SUPABASE_URL || !SERVICE_KEY || !PUBLISHABLE_KEY) {
    return reply({ error: "reports_backend_not_configured" }, 503, origin);
  }
  const supplied = request.headers.get("apikey")?.trim() ?? "";
  if (!safeEqual(supplied, PUBLISHABLE_KEY)) return reply({ error: "invalid_app_key" }, 401, origin);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateAllowed(ip)) return reply({ error: "rate_limit_exceeded" }, 429, origin);

  let payload: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    payload = parsed as Record<string, unknown>;
  } catch {
    return reply({ error: "invalid_json" }, 400, origin);
  }

  try {
    if (payload.action === "insert") {
      const report = payload.report;
      if (!report || typeof report !== "object" || Array.isArray(report)) {
        return reply({ error: "invalid_report" }, 400, origin);
      }
      const r = report as Record<string, unknown>;
      const fieldId = typeof r.field_id === "string" ? r.field_id.trim() : "";
      const disease = typeof r.disease === "string" ? r.disease.trim() : "";
      const confidence = r.confidence == null ? null : Number(r.confidence);
      const point = { latitude: Number(r.latitude), longitude: Number(r.longitude) };
      if (!fieldId || fieldId.length > 120 || !disease || disease.length > 160 ||
          !validPoint(point) ||
          (confidence !== null && (!Number.isFinite(confidence) || confidence < 0 || confidence > 100))) {
        return reply({ error: "invalid_report" }, 400, origin);
      }
      const row = {
        field_id: fieldId,
        disease,
        latitude: point.latitude,
        longitude: point.longitude,
        confidence,
        source: "image_scan",
      };
      const inserted = await dbRequest("disease_reports?select=id,field_id,disease,latitude,longitude,confidence,created_at", {
        method: "POST",
        headers: { "Prefer": "return=representation" },
        body: JSON.stringify(row),
      });
      return reply({ saved: true, report: Array.isArray(inserted) ? inserted[0] : inserted }, 200, origin);
    }

    if (payload.action === "nearby") {
      const values = Array.isArray(payload.fields) ? payload.fields.slice(0, MAX_FIELDS) : [];
      const points = values.filter(validPoint);
      if (!points.length) return reply({ reports: [] }, 200, origin);
      const cutoff = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
      const found = new Map<string, Record<string, unknown>>();
      for (const point of points) {
        const latDelta = 5 / 111.32;
        const lonDelta = 5 / Math.max(1, 111.32 * Math.cos(point.latitude * Math.PI / 180));
        const params = new URLSearchParams();
        params.set("select", "id,field_id,disease,latitude,longitude,confidence,created_at");
        const minLat = Math.max(-90, point.latitude - latDelta);
        const maxLat = Math.min(90, point.latitude + latDelta);
        const minLon = Math.max(-180, point.longitude - lonDelta);
        const maxLon = Math.min(180, point.longitude + lonDelta);
        params.set("and", `(created_at.gte.${cutoff},latitude.gte.${minLat},latitude.lte.${maxLat},longitude.gte.${minLon},longitude.lte.${maxLon})`);
        params.set("order", "created_at.desc");
        params.set("limit", String(MAX_REPORTS_PER_FIELD));
        const rows = await dbRequest("disease_reports?" + params.toString()) as Record<string, unknown>[];
        for (const row of Array.isArray(rows) ? rows : []) {
          const lat = Number(row.latitude), lon = Number(row.longitude);
          if (!validPoint({ latitude: lat, longitude: lon })) continue;
          if (distanceKm(point.latitude, point.longitude, lat, lon) <= 5 && typeof row.id === "string") {
            found.set(row.id, row);
          }
        }
      }
      return reply({ reports: [...found.values()].slice(0, 500) }, 200, origin);
    }

    return reply({ error: "unknown_action" }, 400, origin);
  } catch (error) {
    console.error("Disease reports request failed:", error);
    return reply({ error: error instanceof Error ? error.message : "reports_service_error" }, 500, origin);
  }
});
