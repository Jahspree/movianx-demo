create table if not exists public.user_content_views (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  session_id text,
  content_id text not null,
  content_type text not null,
  event_type text not null default 'started',
  watch_duration_seconds integer not null default 0,
  completion_percentage numeric(5,2) not null default 0,
  pages_viewed integer not null default 0,
  mode_selected text,
  ending_selected text,
  replay_count integer not null default 0,
  listening_duration_seconds integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint user_content_views_content_type_check check (content_type in ('movie', 'story', 'music')),
  constraint user_content_views_event_type_check check (event_type in ('started', 'progress', 'replay')),
  constraint user_content_views_completion_check check (completion_percentage >= 0 and completion_percentage <= 100)
);

create table if not exists public.user_content_completions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  session_id text,
  content_id text not null,
  content_type text not null,
  watch_duration_seconds integer not null default 0,
  completion_percentage numeric(5,2) not null default 100,
  pages_viewed integer not null default 0,
  mode_selected text,
  ending_selected text,
  replay_count integer not null default 0,
  listening_duration_seconds integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now(),
  constraint user_content_completions_content_type_check check (content_type in ('movie', 'story', 'music')),
  constraint user_content_completions_completion_check check (completion_percentage >= 0 and completion_percentage <= 100)
);

create table if not exists public.user_content_likes (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  content_id text not null,
  content_type text not null,
  liked_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint user_content_likes_content_type_check check (content_type in ('movie', 'story', 'music', 'creator')),
  constraint user_content_likes_unique unique (user_id, content_id)
);

create table if not exists public.user_creator_affinity (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  creator_id text not null,
  profile_views integer not null default 0,
  followed boolean not null default false,
  content_consumed_count integer not null default 0,
  affinity_score numeric(8,4) not null default 0,
  last_event_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint user_creator_affinity_unique unique (user_id, creator_id)
);

create table if not exists public.content_affinity (
  id uuid primary key default gen_random_uuid(),
  source_content_id text not null,
  target_content_id text not null,
  affinity_score numeric(8,4) not null default 0,
  relationship_type text not null default 'similar_content',
  reason text not null default '',
  signals jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default now(),
  constraint content_affinity_distinct_check check (source_content_id <> target_content_id),
  constraint content_affinity_score_check check (affinity_score >= 0 and affinity_score <= 1),
  constraint content_affinity_unique unique (source_content_id, target_content_id, relationship_type)
);

create table if not exists public.genre_affinity (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  genre text not null,
  affinity_score numeric(8,4) not null default 0,
  source_event_count integer not null default 0,
  last_event_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint genre_affinity_score_check check (affinity_score >= 0),
  constraint genre_affinity_unique unique (user_id, genre)
);

create table if not exists public.viewer_similarity (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  similar_user_id text not null,
  similarity_score numeric(8,4) not null default 0,
  shared_genres text[] not null default '{}',
  shared_creators text[] not null default '{}',
  shared_content text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default now(),
  constraint viewer_similarity_distinct_check check (user_id <> similar_user_id),
  constraint viewer_similarity_score_check check (similarity_score >= 0 and similarity_score <= 1),
  constraint viewer_similarity_unique unique (user_id, similar_user_id)
);

create table if not exists public.recommendation_events (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  session_id text,
  recommendation_type text not null,
  source_content_id text,
  recommended_content_id text,
  creator_id text,
  score numeric(8,4) not null default 0,
  position integer not null default 0,
  outcome text not null default 'shown',
  context text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint recommendation_events_type_check check (
    recommendation_type in ('because_you_watched', 'similar_content', 'you_may_also_like', 'popular_with_viewers_like_you', 'creator_recommendation', 'trending')
  ),
  constraint recommendation_events_outcome_check check (outcome in ('shown', 'clicked', 'dismissed', 'started', 'completed'))
);

create index if not exists user_content_views_user_idx
  on public.user_content_views (user_id, created_at desc);
create index if not exists user_content_views_content_idx
  on public.user_content_views (content_id, created_at desc);
create index if not exists user_content_completions_user_idx
  on public.user_content_completions (user_id, completed_at desc);
create index if not exists user_content_completions_content_idx
  on public.user_content_completions (content_id, completed_at desc);
create index if not exists user_content_likes_content_idx
  on public.user_content_likes (content_id, liked_at desc);
create index if not exists user_creator_affinity_user_idx
  on public.user_creator_affinity (user_id, affinity_score desc);
create index if not exists content_affinity_source_idx
  on public.content_affinity (source_content_id, affinity_score desc);
create index if not exists content_affinity_target_idx
  on public.content_affinity (target_content_id, affinity_score desc);
create index if not exists genre_affinity_user_idx
  on public.genre_affinity (user_id, affinity_score desc);
create index if not exists viewer_similarity_user_idx
  on public.viewer_similarity (user_id, similarity_score desc);
create index if not exists recommendation_events_user_idx
  on public.recommendation_events (user_id, created_at desc);
create index if not exists recommendation_events_type_idx
  on public.recommendation_events (recommendation_type, created_at desc);

alter table public.user_content_views enable row level security;
alter table public.user_content_completions enable row level security;
alter table public.user_content_likes enable row level security;
alter table public.user_creator_affinity enable row level security;
alter table public.content_affinity enable row level security;
alter table public.genre_affinity enable row level security;
alter table public.viewer_similarity enable row level security;
alter table public.recommendation_events enable row level security;

revoke all on public.user_content_views from anon, authenticated;
revoke all on public.user_content_completions from anon, authenticated;
revoke all on public.user_content_likes from anon, authenticated;
revoke all on public.user_creator_affinity from anon, authenticated;
revoke all on public.content_affinity from anon, authenticated;
revoke all on public.genre_affinity from anon, authenticated;
revoke all on public.viewer_similarity from anon, authenticated;
revoke all on public.recommendation_events from anon, authenticated;

insert into public.content_affinity (
  source_content_id,
  target_content_id,
  affinity_score,
  relationship_type,
  reason,
  signals,
  metadata
) values
  ('nosferatu', 'story-3', 0.9100, 'similar_content', 'Shared dread, nighttime vulnerability, and psychological horror pacing.', '{"seeded": true, "source": "editorial"}'::jsonb, '{"label": "Nosferatu -> 10 Seconds"}'::jsonb),
  ('nosferatu', 'wraith', 0.8700, 'similar_content', 'Silent-era shadow language mapped to spectral atmospheric discovery.', '{"seeded": true, "source": "editorial"}'::jsonb, '{"label": "Nosferatu -> Wraith"}'::jsonb),
  ('wraith', 'sirens', 0.8200, 'similar_content', 'Shared supernatural atmosphere and slow-burn sensory tension.', '{"seeded": true, "source": "editorial"}'::jsonb, '{"label": "Wraith -> Sirens"}'::jsonb),
  ('night-of-the-living-dead', 'story-3', 0.8900, 'because_you_watched', 'Survival pressure and home-invasion panic sit in the same emotional corridor.', '{"seeded": true, "source": "editorial"}'::jsonb, '{"label": "Night of the Living Dead -> 10 Seconds"}'::jsonb),
  ('story-3', 'music-echoes-in-orbit', 0.6400, 'you_may_also_like', 'A controlled descent from panic into spatial memory and quiet signal.', '{"seeded": true, "source": "editorial"}'::jsonb, '{"label": "10 Seconds -> Echoes in Orbit"}'::jsonb)
on conflict (source_content_id, target_content_id, relationship_type) do update set
  affinity_score = excluded.affinity_score,
  reason = excluded.reason,
  signals = excluded.signals,
  metadata = excluded.metadata,
  generated_at = now();
