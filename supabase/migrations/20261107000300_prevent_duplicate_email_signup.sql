-- Supabase Before User Created Auth Hook:
-- Reject duplicate email registrations server-side instead of relying only
-- on the client-side identities[] obfuscation response.
create or replace function public.hook_prevent_duplicate_email_signup(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_email text;
begin
  normalized_email := lower(btrim(coalesce(event #>> '{user,email}', '')));

  if normalized_email = '' then
    return '{}'::jsonb;
  end if;

  if exists (
    select 1
    from auth.users as existing_user
    where lower(existing_user.email) = normalized_email
      and existing_user.deleted_at is null
  ) then
    return jsonb_build_object(
      'error',
      jsonb_build_object(
        'http_code', 409,
        'message', 'An account with this email already exists. Please sign in or use Forgot password.'
      )
    );
  end if;

  return '{}'::jsonb;
end;
$$;

revoke all on function public.hook_prevent_duplicate_email_signup(jsonb) from public;
revoke all on function public.hook_prevent_duplicate_email_signup(jsonb) from anon, authenticated;
grant execute on function public.hook_prevent_duplicate_email_signup(jsonb) to supabase_auth_admin;

comment on function public.hook_prevent_duplicate_email_signup(jsonb) is
  'Supabase Auth Before User Created hook: blocks signup attempts for an existing email address.';
