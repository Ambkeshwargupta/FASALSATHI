# FASALSATHI backend setup

This repository is intentionally isolated from the original `newcoder355/fasal-sathi-` project. The former frontend pointed at a Supabase hostname that currently returns DNS `NXDOMAIN`; copying that URL into this deployment would keep photo analysis broken.

## 1. Create a dedicated Supabase project

Create a new Supabase project for **FASALSATHI**. From Project Settings → API, copy:

- Project URL, for example `https://<project-ref>.supabase.co`
- Publishable key (or legacy anon key if that is what the project provides)

Edit `app-config.js` and set the two public frontend values:

```js
window.FASALSATHI_CONFIG = Object.freeze({
  supabaseUrl: "https://YOUR-NEW-PROJECT-REF.supabase.co",
  supabasePublishableKey: "YOUR_NEW_SUPABASE_PUBLISHABLE_KEY",
  scanFunctionName: "rapid-endpoint"
});
```

The Supabase URL and publishable key are intended for browser use. Do not put a Supabase secret/service-role key or the Kindwise API key in this file.

Until this is configured, the scanner deliberately shows a setup message instead of sending requests to the retired project URL.

## 2. Add GitHub Actions repository secrets

In GitHub → FASALSATHI → Settings → Secrets and variables → Actions, create:

| Secret | Value |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Personal access token from your Supabase account |
| `SUPABASE_PROJECT_REF` | The project reference from the new Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | The same publishable/anon key entered in `app-config.js` |
| `CROP_HEALTH_API_KEY` | The Crop.health API key from the Kindwise admin panel |

The deployment workflow copies `CROP_HEALTH_API_KEY` to Supabase Edge Function Secrets. It is never placed in the frontend or committed to Git.

## 3. Deploy the Edge Function

Open the repository Actions tab, choose **Deploy Crop.health Edge Function**, and select **Run workflow**. It links the new Supabase project, sets the server-side secrets, and deploys:

`supabase/functions/rapid-endpoint/index.ts`

The function accepts the current frontend contract `POST { "image": "<base64>" }`, calls the official Crop.health identification API server-side, and returns the native result object expected by `crop-scan.js`. It handles browser CORS for `https://ambkeshwargupta.github.io` and local development origins.

The Edge Function has platform JWT verification disabled because this static prototype does not have Supabase Auth sessions. It validates the public `apikey` header against a server-side copy of the app's publishable key, validates image size/type, and applies a per-instance request throttle. That per-instance throttle is a basic abuse guard, not a global quota system; add persistent rate limiting before broad public launch.

## 4. Alerts and reports

Photo identification is independent of the `disease_reports` table. Saving reports and displaying nearby alerts still require a separate table/migration and policies. Those are intentionally not invented here; implement them when the FASALSATHI alert-management requirements are finalized.

## Current status

- Frontend configuration is isolated in `app-config.js`.
- The old, non-resolving Supabase project reference is no longer present in the frontend.
- The Edge Function source and deployment workflow are committed in this repository.
- Live photo analysis remains inactive until a new Supabase project and the two provider/project keys above are configured and the function is deployed.
