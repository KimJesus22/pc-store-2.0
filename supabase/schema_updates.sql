-- Add role to profiles
create type public.user_role as enum ('USER', 'ADMIN', 'MODERATOR');
alter table public.profiles add column role public.user_role default 'USER'::public.user_role;

-- Create Audit Logs
create table public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references public.profiles(id) not null,
  action text not null,
  target_id uuid, -- Can be dispute_id, user_id, etc.
  details jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Audit Logs
alter table public.audit_logs enable row level security;

create policy "Admins can view audit logs"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'ADMIN'
    )
  );

create policy "Admins can insert audit logs"
  on public.audit_logs for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'ADMIN'
    )
  );

-- Function to check admin (optional helper for RLS but using subqueries for now)
