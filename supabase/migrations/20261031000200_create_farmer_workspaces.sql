-- Each authenticated farmer owns one private cloud workspace.
-- The JSON document contains field records and scan results, not original photo files.
create table if not exists public.farmer_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  workspace jsonb not null default '{"fields":[],"unlinkedScans":[]}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint farmer_workspaces_workspace_object check (jsonb_typeof(workspace) = 'object'),
  constraint farmer_workspaces_fields_array check (
    jsonb_typeof(workspace->'fields') = 'array'
    and jsonb_array_length(workspace->'fields') <= 100
  ),
  constraint farmer_workspaces_unlinked_scans_array check (
    jsonb_typeof(workspace->'unlinkedScans') = 'array'
    and jsonb_array_length(workspace->'unlinkedScans') <= 5
  ),
  constraint farmer_workspaces_payload_size check (octet_length(workspace::text) <= 2097152)
);

create index if not exists farmer_workspaces_updated_at_idx
  on public.farmer_workspaces (updated_at desc);

alter table public.farmer_workspaces enable row level security;

revoke all on table public.farmer_workspaces from anon;
grant select, insert, update on table public.farmer_workspaces to authenticated;

drop policy if exists "Farmers can read their own workspace" on public.farmer_workspaces;
create policy "Farmers can read their own workspace"
  on public.farmer_workspaces
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Farmers can create their own workspace" on public.farmer_workspaces;
create policy "Farmers can create their own workspace"
  on public.farmer_workspaces
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Farmers can update their own workspace" on public.farmer_workspaces;
create policy "Farmers can update their own workspace"
  on public.farmer_workspaces
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

comment on table public.farmer_workspaces is
  'Private per-user FASALSATHI field records and crop scan metadata. RLS restricts every row to its owning auth user.';
