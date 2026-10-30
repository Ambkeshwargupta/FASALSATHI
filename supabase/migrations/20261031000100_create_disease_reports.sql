-- Cloud disease reports used for anonymous, nearby disease-activity alerts.
-- Direct browser access is intentionally denied; only Edge Functions use service-role access.
create extension if not exists pgcrypto;

create table if not exists public.disease_reports (
  id uuid primary key default gen_random_uuid(),
  field_id text not null check (length(field_id) between 1 and 120),
  disease text not null check (length(disease) between 1 and 160),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  confidence numeric(5,2) check (confidence is null or confidence between 0 and 100),
  source text not null default 'image_scan' check (source in ('image_scan')),
  created_at timestamptz not null default now()
);

create index if not exists disease_reports_created_at_idx
  on public.disease_reports (created_at desc);

create index if not exists disease_reports_coordinates_idx
  on public.disease_reports (latitude, longitude);

create index if not exists disease_reports_disease_created_at_idx
  on public.disease_reports (disease, created_at desc);

alter table public.disease_reports enable row level security;

-- No public/anon/authenticated direct access. The reports Edge Function
-- validates input and exposes only nearby, limited report fields.
revoke all on table public.disease_reports from anon, authenticated;
grant all on table public.disease_reports to service_role;
