create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id uuid references public.groups(id) on delete set null,
  title text not null default 'Untitled note',
  content text not null default '',
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.groups enable row level security;
alter table public.notes enable row level security;

create policy "Users can read own groups"
on public.groups for select
using (auth.uid() = user_id);

create policy "Users can create own groups"
on public.groups for insert
with check (auth.uid() = user_id);

create policy "Users can update own groups"
on public.groups for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own groups"
on public.groups for delete
using (auth.uid() = user_id);

create policy "Users can read own notes"
on public.notes for select
using (auth.uid() = user_id);

create policy "Users can create own notes"
on public.notes for insert
with check (auth.uid() = user_id);

create policy "Users can update own notes"
on public.notes for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own notes"
on public.notes for delete
using (auth.uid() = user_id);

create index if not exists groups_user_id_idx on public.groups(user_id);
create index if not exists notes_user_id_idx on public.notes(user_id);
create index if not exists notes_group_id_idx on public.notes(group_id);
create index if not exists notes_pinned_updated_idx on public.notes(user_id, pinned desc, updated_at desc);
