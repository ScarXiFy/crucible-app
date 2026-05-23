create extension if not exists pgcrypto;
create schema if not exists private;

create type public.user_role as enum ('student', 'admin');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now()
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  subject text,
  is_published boolean not null default true,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  prompt text not null,
  position integer not null default 1,
  created_at timestamptz not null default now()
);

create table public.options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  label text not null,
  is_correct boolean not null default false,
  position integer not null default 1,
  created_at timestamptz not null default now()
);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  score integer not null default 0,
  total_questions integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.scores (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null unique references public.attempts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  value integer not null,
  total integer not null,
  created_at timestamptz not null default now()
);

create index quizzes_created_by_idx on public.quizzes(created_by);
create index questions_quiz_id_position_idx on public.questions(quiz_id, position);
create index options_question_id_position_idx on public.options(question_id, position);
create index attempts_user_id_created_at_idx on public.attempts(user_id, created_at desc);
create index attempts_quiz_id_idx on public.attempts(quiz_id);
create index scores_user_id_created_at_idx on public.scores(user_id, created_at desc);

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.users enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.options enable row level security;
alter table public.attempts enable row level security;
alter table public.scores enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.quizzes, public.questions, public.options to anon, authenticated;
grant select, insert, update on public.users to authenticated;
grant insert, update, delete on public.quizzes, public.questions, public.options to authenticated;
grant select, insert on public.attempts, public.scores to authenticated;

create policy "Users can view their own profile"
on public.users for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can create their own student profile"
on public.users for insert
to authenticated
with check ((select auth.uid()) = id and role = 'student');

create policy "Users can update their own email only"
on public.users for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Published quizzes are readable"
on public.quizzes for select
to anon, authenticated
using (is_published = true);

create policy "Admins can create quizzes"
on public.quizzes for insert
to authenticated
with check (
  exists (
    select 1 from public.users
    where users.id = (select auth.uid())
      and users.role = 'admin'
  )
);

create policy "Admins can update quizzes"
on public.quizzes for update
to authenticated
using (
  exists (
    select 1 from public.users
    where users.id = (select auth.uid())
      and users.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.users
    where users.id = (select auth.uid())
      and users.role = 'admin'
  )
);

create policy "Questions for published quizzes are readable"
on public.questions for select
to anon, authenticated
using (
  exists (
    select 1 from public.quizzes
    where quizzes.id = questions.quiz_id
      and quizzes.is_published = true
  )
);

create policy "Admins can manage questions"
on public.questions for all
to authenticated
using (
  exists (
    select 1 from public.users
    where users.id = (select auth.uid())
      and users.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.users
    where users.id = (select auth.uid())
      and users.role = 'admin'
  )
);

create policy "Options for published quizzes are readable"
on public.options for select
to anon, authenticated
using (
  exists (
    select 1
    from public.questions
    join public.quizzes on quizzes.id = questions.quiz_id
    where questions.id = options.question_id
      and quizzes.is_published = true
  )
);

create policy "Admins can manage options"
on public.options for all
to authenticated
using (
  exists (
    select 1 from public.users
    where users.id = (select auth.uid())
      and users.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.users
    where users.id = (select auth.uid())
      and users.role = 'admin'
  )
);

create policy "Users can view their own attempts"
on public.attempts for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own attempts"
on public.attempts for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can view their own scores"
on public.scores for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own scores"
on public.scores for insert
to authenticated
with check ((select auth.uid()) = user_id);
