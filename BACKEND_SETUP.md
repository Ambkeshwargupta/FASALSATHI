# FASALSATHI backend setup

This is a separate backend for the `Ambkeshwargupta/FASALSATHI` repository. It does not reuse the retired Supabase project used by the original prototype.

## Already configured

- New Supabase URL and browser publishable key are in `app-config.js`.
- The Crop.health image proxy is in `supabase/functions/rapid-endpoint/index.ts`.
- The nearby disease-report service is in `supabase/functions/disease-reports/index.ts`.
- The private `disease_reports` schema is in `supabase/migrations/`.
- Both functions and the migration can be deployed by the GitHub Actions workflow **Deploy FASALSATHI database and Edge Functions**.

## 1. Create the Crop.health API key

1. Open the [Kindwise admin panel](https://admin.kindwise.com/).
2. Create an API key for the **Crop.health** product (not Plant.id or Plant.health).
3. Allocate credits to the key. Check the balance and any usage limits before testing.
4. Copy the API key once and keep it private.

Kindwise documents the Crop.health identification API and its image-based crop/disease suggestions in its [Crop.health guide](https://www.kindwise.com/crop-health) and [example client](https://github.com/flowerchecker/crop-health-examples). The key is used only by the Supabase Edge Function, never by browser JavaScript.

## 2. Create three GitHub Actions secrets

Open [FASALSATHI → Settings → Secrets and variables → Actions](https://github.com/Ambkeshwargupta/FASALSATHI/settings/secrets/actions), click **New repository secret**, and add these three secrets:

| Secret name | Value / where to get it |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Create a personal access token in [Supabase Account → Access Tokens](https://supabase.com/dashboard/account/tokens). |
| `SUPABASE_DB_PASSWORD` | The database password you created with this Supabase project. If you no longer know it, reset it in Supabase Project Settings → Database. |
| `CROP_HEALTH_API_KEY` | The Crop.health key created in Step 1. |

Do **not** create a `SUPABASE_PUBLISHABLE_KEY` secret. Supabase injects the project's publishable key into its Edge Function runtime; the function validates the browser's `apikey` header against that managed value.

Do not paste access tokens, database passwords, or the Crop.health key into chat, source files, or screenshots.

## 3. Deploy database and functions

After adding all three secrets:

1. Open the repository [Actions tab](https://github.com/Ambkeshwargupta/FASALSATHI/actions).
2. Select **Deploy FASALSATHI database and Edge Functions**.
3. Click **Run workflow** on branch `main`.
4. Wait for the workflow to complete successfully.

The workflow checks both TypeScript functions, links the Supabase project, applies the database migration, stores the Crop.health key as a server-side Edge Function secret, and deploys `rapid-endpoint` and `disease-reports`.

## 4. What the backend does

### Crop scanner

The browser sends a base64 crop image to `rapid-endpoint`. The function calls Crop.health server-to-server and returns the Crop.health result for the existing tomato validation and result UI. The provider key stays in Supabase secrets.

### Disease reports and nearby alerts

The browser no longer reads or writes `disease_reports` directly. The `disease-reports` Edge Function uses the server-side Supabase key, and the SQL migration enables RLS while revoking direct table privileges from `anon` and `authenticated`. The function accepts validated image-scan reports and only returns reports within 5 km of the supplied saved field coordinates, from the previous five days.

Reports include the saved field's coordinates and disease name so the app can calculate nearby activity. These are community-submitted, unconfirmed reports—not verified outbreaks. Because this prototype has no farmer login, the public report endpoint cannot prove a report's author; rate limits and validation reduce casual abuse but are not a substitute for authenticated accounts and durable abuse controls. Do not use the current nearby-report feature as an official disease-warning service.

## 5. Test the new deployment

After a successful workflow run:

- Open the live site: [FASALSATHI](https://ambkeshwargupta.github.io/FASALSATHI/).
- Upload a clear, close-up tomato-leaf photo (not a poster, screenshot, or unrelated image).
- Confirm the scanner returns a Crop.health assessment and that a confident non-tomato image is rejected.
- Save a valid assessment to a field, then open Alerts to test the nearby-report path.

Use one or two test photos first; real Crop.health checks may consume credits.

## Troubleshooting

- **`scanBackendSetup`**: check `app-config.js` is configured and the latest GitHub Pages deployment succeeded.
- **HTTP 401 / invalid app key**: ensure the site uses the publishable key belonging to this exact Supabase project, then refresh the page.
- **HTTP 503 / backend not configured**: add `CROP_HEALTH_API_KEY` as an Edge Function secret and rerun the backend workflow.
- **HTTP 502 from Crop.health**: check the Crop.health API key, credit balance, usage limits, and Supabase function logs.
- **Workflow fails before deployment**: check the three GitHub repository secrets; the database password and Supabase access token are separate credentials.

The Supabase database password, access token and Kindwise key remain private. Never commit them to GitHub.
