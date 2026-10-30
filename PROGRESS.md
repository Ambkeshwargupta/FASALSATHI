# Current work checkpoint

Repository: `newcoder355/fasal-sathi-` · branch: `main`

Live app: https://newcoder355.github.io/fasal-sathi-/

## Current implementation

- Language selection opens the local workspace directly. Fields and photo assessments are preserved in browser storage.
- New field setup requests location permission; manual map adjustment and GPS retry remain available. Coordinates and technical model inputs are hidden from farmer-facing screens.
- Open-Meteo feeds local TOMCAST weather-risk calculations with stale/missing-data handling and automatic refresh. The UI uses readable risk levels.
- Real Crop.health photo checks use the deployed Supabase `rapid-endpoint` function. The provider secret stays server-side. Accepted results retain symptoms, severity, treatment and alternatives when supplied.
- Tomato validation rejects non-tomato predictions at >=60%. Positive tomato identification and usable issue confidence use 50% thresholds. Uncertain crops can use a registered Tomato field; disease probabilities remain unchanged. Rejected results cannot be saved or reported through the app.
- Supabase-backed nearby alerts preserve the latest report-grouping changes, including separate isolated-report cards. See README and MODEL for limitations.

## Latest functional checkpoint

Commit `0ed07714976ea14b46fa7b0ad2056739888f917c`: tomato-only scan validation. Validation completed with 26 unit/model tests and 82 mocked browser checks, including accepted tomato, low-confidence crop fallback, confident wrong-crop rejection, weak-result rejection, retry, storage, language and mobile cases.

Real photo analysis and real weather retrieval were verified during the earlier integration. Later validation/display changes were tested with controlled API responses; do not describe those checks as new live API calls.

## Repository cleanup

Updated README to reflect current functionality, service configuration, local setup, tests, storage and limitations. Removed local leftovers of `index (1).html` and `nojekyll`; both had already been deleted from GitHub. Retained the actual `.nojekyll` marker, application modules, test fixtures and useful documentation. Added ignores for local dependencies, test output and environment secrets. Older checkpoint narratives remain recoverable from Git history.

## Resume workflow

1. Inspect `git status`, recent commits and current GitHub `main` before editing. Other sessions may have pushed newer changes.
2. Preserve the existing app and merge current remote changes; never overwrite them with an old full-file copy.
3. Run relevant checks documented in README. Live image tests consume provider credits; use mocked responses for routine regressions.
4. Push tested, coherent checkpoints during longer tasks. Record completed work and any remaining blockers here.
5. Never commit Kindwise secrets. The Supabase publishable key is frontend configuration, not a provider secret.


## Interface redesign checkpoint — 31 October 2026

- Added `app.css` as a dedicated visual layer, preserving the existing static HTML/JavaScript deployment model.
- Replaced the narrow centered app shell on signed-in screens with a responsive workspace: forest-green desktop sidebar, sticky utility header, spacious content canvas, and compact mobile bottom navigation.
- Rebuilt the home screen as a data-driven farm overview with field count, photo assessment count, selected field, TOMCAST five-day outlook, local Open-Meteo conditions, field list and recent photo assessments.
- Connected dashboard cards to the existing browser-stored field and scan records. Forecast labels are derived from the existing TOMCAST engine; unavailable/stale data remain unavailable rather than being represented as low risk.
- Preserved `tomcast.js`, `crop-scan.js`, Supabase calls, field storage, language dictionaries, existing setup flow and existing screen IDs.
- No new backend or diagnostic claims were introduced. The dashboard continues to describe photo results as automated suggestions and TOMCAST as weather favourability, not confirmed infection.
- Changes committed to `main`: `d2c722a` (stylesheet), `52f85b3` (application shell and dashboard markup), `364af83` (live dashboard data binding), `b0d3683` (header polish).
- Automated CI status checks were not configured/reported for these commits. Run the repository's documented Node and Playwright suites before treating the UI as fully regression-verified.

- Follow-up layout fix: offset the signed-in desktop app canvas by the fixed 258px sidebar width above 1120px, preventing the navigation rail from covering the dashboard content. The compact-rail and mobile breakpoints retain their own offsets.

- Second sidebar-overlap correction: reserve the fixed rail width using `body.signed-in { padding-left: ... }` at desktop/tablet breakpoints instead of relying on shifting the app wrapper that contains the fixed rail. The app wrapper is explicitly reset to full width of the body's remaining content area; mobile returns to zero left padding.

- Third layout correction: desktop/tablet offsets now apply directly to the app's topbar, setup progress region, and main content using `margin-left` plus reduced width; the body and `.app` wrapper remain viewport-wide. Mobile explicitly resets these regions to full width. This avoids the earlier body-padding/wrapper-offset approaches that did not move the dashboard's actual content region.

- Definitive sidebar rebuild: replaced the fixed-overlay/margin-compensation layout with a true CSS Grid workspace. On desktop the sidebar occupies grid column 1 (258px) and remains sticky; topbar, progress strip and main content occupy grid column 2. Tablet uses an 83px rail. Mobile switches back to a single-column layout with the existing bottom nav. Added a versioned stylesheet URL to force clients to fetch the revised layout CSS. This supersedes the previous margin/body-padding fixes.


## Crop photo service connectivity investigation — 31 October 2026

- The Hindi UI error shown during photo check maps to `scanNetworkError` from `crop-scan.js`: the browser's `fetch()` failed before a readable HTTP response was received.
- `index.html` points photo checks to the Supabase Edge Function `https://cyopgofpflgnhzgmvynb.supabase.co/functions/v1/rapid-endpoint`. The original and new repositories still reference the same Supabase project and function.
- The repository does not contain the deployed Edge Function source. The README explicitly notes that the function and database migrations are not provisioned by cloning this frontend.
- A GitHub Actions reachability probe in this repository attempted an OPTIONS preflight and failed at DNS resolution: `curl: (6) Could not resolve host: cyopgofpflgnhzgmvynb.supabase.co`. This explains why the browser reports a connection failure; it is not caused by the selected image's preview or the page layout.
- Added `.github/workflows/diagnose-scan-endpoint.yml` to investigate DNS and CORS for the new and original GitHub Pages origins. A follow-up run adds DNS-over-HTTPS lookup before repeating the preflight.
- No files or services in the original `newcoder355/fasal-sathi-` repository were changed during this investigation.
- To complete an isolated fix in this repository, it needs an active Supabase project URL and a deployed browser-accessible Crop.health Edge Function (with CORS for `https://ambkeshwargupta.github.io`). The Kindwise API key must remain in server-side Supabase secrets, not in browser code.


## Crop photo service fix — FASALSATHI-only checkpoint

- Confirmed the old frontend's Supabase hostname `cyopgofpflgnhzgmvynb.supabase.co` resolves to DNS status 3 (NXDOMAIN) in the FASALSATHI repository's GitHub Actions diagnostic. Both the old and cloned prototype had inherited that same dead backend reference; the photo request fails before reaching any model.
- Removed that retired URL and key from this repository's `index.html`. The new `app-config.js` holds only the public project URL and publishable key. Until a dedicated project is configured, the scanner now reports that setup is required instead of showing a misleading internet/network error.
- Added `supabase/functions/rapid-endpoint/index.ts`, a server-side Crop.health proxy. The Kindwise API key remains in Supabase Edge Function Secrets; the function handles CORS, validates the request, forwards the image to Crop.health and returns its native response for the existing parser.
- Added `supabase/config.toml`, `BACKEND_SETUP.md`, and a manual GitHub Actions workflow to set backend secrets and deploy the function into the new Supabase project.
- No changes were made to `newcoder355/fasal-sathi-`.
- Live scanning is not yet active: the new repo still needs a newly created Supabase project, its URL and publishable key in `app-config.js`, and the GitHub Actions secrets `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_PUBLISHABLE_KEY`, and `CROP_HEALTH_API_KEY`. The app cannot complete this external provisioning without those project credentials.
- Test scanning only with a clear tomato-leaf photo. The screenshot image is a Vectornest promotional poster, so the real scanner should reject it as a non-crop image once the API is connected.


## Dedicated Supabase backend build — 31 October 2026

- Confirmed the new Supabase project URL and publishable key are now committed in `app-config.js`. The browser config uses only the publishable key; no Supabase secret or Kindwise provider key is placed in frontend source.
- The retired Supabase project URL is absent from the new frontend.
- Updated `rapid-endpoint` to validate the browser key against Supabase's managed `SUPABASE_PUBLISHABLE_KEYS` environment value (legacy anon-key fallback retained), avoiding a redundant manually configured publishable-key secret.
- Added `disease-reports` Edge Function. It uses the Supabase server-side secret key, validates submitted scan-report data, rate-limits by request IP (per Edge isolate), and returns only reports within 5 km of supplied field locations and within the prior five days.
- Added `supabase/migrations/20261031000100_create_disease_reports.sql`. The table has RLS enabled and direct grants revoked from `anon` and `authenticated`; only server-side service-role access is granted.
- Updated the browser to send report inserts and nearby-report reads through `disease-reports`; there are no remaining direct `supabaseClient.from(...)` table calls in `index.html`.
- Added `SUPABASE_DB_PASSWORD` to the backend deployment workflow. It links the project, applies migrations, sets the Crop.health provider key as a Supabase secret, and deploys both Edge Functions.
- Updated `BACKEND_SETUP.md` and README with the full deployment steps and the privacy/abuse limitations of anonymous community reports.
- Validation completed: frontend inline JavaScript and `app-config.js` parse successfully; repository source checks confirm no old Supabase hostname remains, no direct browser table access remains, migration RLS is present, and both Edge Functions are wired.
- Remaining activation dependency: the user must add four repository Actions secrets (`SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD`, `CROP_HEALTH_API_KEY`) and manually run **Deploy FASALSATHI database and Edge Functions**. Live scanner/database operation is not yet verified because the deployment credentials and Kindwise key have not been configured in GitHub Secrets.
