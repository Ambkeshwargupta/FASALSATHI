# FASALSATHI backend setup

This is a separate backend for the `Ambkeshwargupta/FASALSATHI` repository. It does not reuse the retired Supabase project used by the original prototype.

## Already configured

- New Supabase URL and browser publishable key are in `app-config.js`.
- The free Pl@ntNet leaf-part preflight is in `supabase/functions/leaf-filter/index.ts`.
- The Crop.health image proxy is in `supabase/functions/rapid-endpoint/index.ts` and requires an authenticated farmer session.
- The nearby disease-report service is in `supabase/functions/disease-reports/index.ts`.
- The private `disease_reports` schema is in `supabase/migrations/`.
- Both functions and the migration can be deployed by the GitHub Actions workflow **Deploy FASALSATHI database and Edge Functions**.

## 1. Create the Crop.health API key

1. Open the [Kindwise admin panel](https://admin.kindwise.com/).
2. Create an API key for **Crop.health**.
3. Add credits as required for Crop.health image assessments.
4. Keep the key private; never paste it into browser code or a public repository.

The key is used only by the `rapid-endpoint` Supabase Edge Function.

## 2. Create the free Pl@ntNet API key for leaf-part detection

1. Open the [Pl@ntNet API developer portal](https://my.plantnet.org/).
2. Create one free API account and generate an API key.
3. The current free plan allows up to **500 identifications per day**, including commercial use within that daily limit; no credit card is required.
4. Copy the key and keep it private.

FASALSATHI sends a photo to Pl@ntNet first with automatic organ detection. Its `predictedOrgans` result identifies the photographed part (for example, leaf or fruit). FASALSATHI proceeds to Crop.health when the part is classified as a leaf or as `scan` (Pl@ntNet's scan/scan-like leaf view) with a score of at least 0.60. This 0.60 is our application gate, not a published Pl@ntNet accuracy guarantee. See the [official organ-detection documentation](https://my.plantnet.org/doc/api/identify) and [free-plan conditions](https://my.plantnet.org/).

## 3. Create five GitHub Actions secrets

Open [FASALSATHI → Settings → Secrets and variables → Actions](https://github.com/Ambkeshwargupta/FASALSATHI/settings/secrets/actions), click **New repository secret**, and add or update these five secrets:

| Secret name | Value / where to get it |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Personal access token from [Supabase Account → Access Tokens](https://supabase.com/dashboard/account/tokens). |
| `SUPABASE_DB_PASSWORD` | The database password for this Supabase project. |
| `SUPABASE_DB_URL` | The project's IPv4-compatible session-pooler connection URI, with its password included. Keep it private. |
| `CROP_HEALTH_API_KEY` | The Crop.health key created in Step 1. |
| `PLANTNET_API_KEY` | The free API key created in Step 2. |

## 4. Deploy database and functions

After adding all five secrets:

1. Open the repository [Actions tab](https://github.com/Ambkeshwargupta/FASALSATHI/actions).
2. Select **Deploy FASALSATHI database and Edge Functions**.
3. Click **Run workflow** on branch `main`.
4. Wait for the workflow to complete successfully.

The workflow type-checks all three TypeScript functions, links the Supabase project, applies database migrations, stores the Crop.health and Pl@ntNet keys as server-side Edge Function secrets, and deploys `leaf-filter`, `rapid-endpoint` and `disease-reports`.

### One-time Supabase Auth Hook activation (required for a definitive duplicate-email error)

The migration creates a server-side **Before User Created** hook function. Activate it once in the Supabase dashboard:

1. Open [Supabase Authentication → Hooks](https://supabase.com/dashboard/project/aaslgfnfdxhgoqwwpgnz/auth/hooks).
2. Find **Before User Created** and enable it.
3. Select **Postgres function** as the hook type.
4. Choose `public.hook_prevent_duplicate_email_signup`.
5. Save the hook configuration.

The hook checks `auth.users` server-side before a new account is created. If the normalized email already exists, it rejects registration with HTTP 409 and an explicit duplicate-account message. The browser then displays the translated **Account already exists** dialog and the OK button takes the farmer to Sign in.

This intentionally reveals whether an email address is registered. That is the requested user experience, but it weakens Supabase's default anti-enumeration privacy protection. Keep Auth rate limits enabled and consider CAPTCHA before opening registration to a large public audience.

## 5. What the backend does

### Crop scanner

The browser sends a base64 crop image to `rapid-endpoint`. The function calls Crop.health server-to-server and returns the Crop.health result for the existing tomato validation and result UI. The provider key stays in Supabase secrets.

### Leaf-only photo gate

Before Crop.health is called, the browser sends the compressed photo to the authenticated `leaf-filter` Edge Function. That function verifies the Supabase farmer session, calls Pl@ntNet using `organs=auto`, and returns the predicted plant part and organ score. FASALSATHI blocks non-leaf and uncertain photos before consuming a Crop.health assessment. The preflight has its own Pl@ntNet free quota (currently 500 requests/day); if the quota or service is unavailable, FASALSATHI stops the scan rather than bypassing the filter.

The `rapid-endpoint` also verifies a valid Supabase user session before calling Crop.health. Both provider keys remain in Supabase Edge Function secrets.

### Disease reports and nearby alerts

The browser no longer reads or writes `disease_reports` directly. The `disease-reports` Edge Function uses the server-side Supabase key, and the SQL migration enables RLS while revoking direct table privileges from `anon` and `authenticated`. The function accepts validated image-scan reports and only returns reports within 5 km of the supplied saved field coordinates, from the previous five days.

Reports include the saved field's coordinates and disease name so the app can calculate nearby activity. These are community-submitted, unconfirmed reports—not verified outbreaks. Nearby community reports remain unconfirmed and should not be treated as verified outbreaks. The report endpoint must continue to be hardened with authenticated farmer ownership checks and durable abuse controls before public production use.

## 6. Test the new deployment

After a successful workflow run:

- Open the live site: [FASALSATHI](https://ambkeshwargupta.github.io/FASALSATHI/).
- Upload a clear, close-up tomato-leaf photo and confirm the leaf preflight passes before Crop.health is called.
- Upload a tomato fruit, flower, unrelated object or non-plant photo and confirm it is rejected before Crop.health is called.
- Confirm a valid tomato-leaf photo then receives a Crop.health assessment.
- Save a valid assessment to a field, then open Alerts to test the nearby-report path.

Use one or two test photos first; real Crop.health checks may consume credits.

## Troubleshooting

- **`scanBackendSetup`**: check `app-config.js` is configured and the latest GitHub Pages deployment succeeded.
- **HTTP 401 / invalid app key**: ensure the site uses the publishable key belonging to this exact Supabase project, then refresh the page.
- **Leaf filter not configured**: check `PLANTNET_API_KEY`, then rerun the backend workflow.
- **Leaf filter quota reached**: the free Pl@ntNet quota is exhausted for the current UTC day; wait for reset.
- **HTTP 503 / Crop.health backend not configured**: check `CROP_HEALTH_API_KEY` as an Edge Function secret and rerun the backend workflow.
- **HTTP 502 from Crop.health**: check the Crop.health API key, credit balance, usage limits, and Supabase function logs.
- **Workflow fails before deployment**: check all five GitHub repository secrets; the Supabase access token, database password and database URI are separate values.

The Supabase database password, access token and Kindwise key remain private. Never commit them to GitHub.
