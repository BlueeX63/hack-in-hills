-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  team_name text not null,
  email text not null,
  github_url text not null,
  social_url text,
  hosted_project_url text not null,
  demo_video_url text not null,
  created_at timestamptz not null default now()
);

alter table public.submissions enable row level security;

-- Anyone can submit a project (the form is public), but no one can read,
-- update, or delete rows via the anon key -- do that from the Supabase
-- dashboard/Table Editor instead.
create policy "Public can insert submissions"
  on public.submissions
  for insert
  to anon
  with check (true);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Anyone can send a message (the form is public), but no one can read,
-- update, or delete rows via the anon key -- do that from the Supabase
-- dashboard/Table Editor instead.
create policy "Public can insert contact messages"
  on public.contact_messages
  for insert
  to anon
  with check (true);
