insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'creator-private-uploads',
  'creator-private-uploads',
  false,
  5368709120,
  array[
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'audio/mpeg',
    'audio/mp4',
    'audio/wav',
    'audio/webm',
    'audio/ogg',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
) on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.creator_upload_records (
  id uuid primary key,
  content_id uuid not null,
  creator_id text not null,
  title text not null,
  description text not null default '',
  genre text not null default '',
  language text not null default '',
  maturity_rating text not null default '',
  tags text[] not null default '{}',
  status text not null default 'uploaded',
  review_status text not null default 'not_submitted',
  review_notes text not null default '',
  last_reviewed_at timestamptz,
  assets jsonb not null default '[]'::jsonb,
  storage_provider text not null default 'supabase-storage',
  security jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint creator_upload_status_check check (
    status in ('uploaded', 'processing', 'under_review', 'approved', 'published', 'flagged', 'rejected')
  ),
  constraint creator_upload_review_status_check check (
    review_status in ('not_submitted', 'pending', 'in_review', 'approved', 'rejected', 'changes_requested')
  )
);

create table if not exists public.creator_upload_audit_logs (
  id uuid primary key,
  actor_id text not null,
  action text not null,
  record_id uuid not null references public.creator_upload_records(id) on delete cascade,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists creator_upload_records_creator_idx
  on public.creator_upload_records (creator_id, updated_at desc);

create index if not exists creator_upload_records_status_idx
  on public.creator_upload_records (status, updated_at desc);

create index if not exists creator_upload_audit_logs_record_idx
  on public.creator_upload_audit_logs (record_id, created_at desc);

create or replace function public.set_creator_upload_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_creator_upload_records_updated_at on public.creator_upload_records;
create trigger set_creator_upload_records_updated_at
before update on public.creator_upload_records
for each row
execute function public.set_creator_upload_updated_at();

alter table public.creator_upload_records enable row level security;
alter table public.creator_upload_audit_logs enable row level security;

revoke all on public.creator_upload_records from anon, authenticated;
revoke all on public.creator_upload_audit_logs from anon, authenticated;
