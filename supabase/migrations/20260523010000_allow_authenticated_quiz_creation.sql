drop policy if exists "Admins can create quizzes" on public.quizzes;
drop policy if exists "Admins can update quizzes" on public.quizzes;
drop policy if exists "Admins can manage questions" on public.questions;
drop policy if exists "Admins can manage options" on public.options;

create policy "Authenticated users can create quizzes"
on public.quizzes for insert
to authenticated
with check ((select auth.uid()) = created_by);

create policy "Quiz creators can update their quizzes"
on public.quizzes for update
to authenticated
using ((select auth.uid()) = created_by)
with check ((select auth.uid()) = created_by);

create policy "Authenticated users can create questions"
on public.questions for insert
to authenticated
with check (
  exists (
    select 1 from public.quizzes
    where quizzes.id = questions.quiz_id
      and quizzes.created_by = (select auth.uid())
  )
);

create policy "Quiz creators can update questions"
on public.questions for update
to authenticated
using (
  exists (
    select 1 from public.quizzes
    where quizzes.id = questions.quiz_id
      and quizzes.created_by = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.quizzes
    where quizzes.id = questions.quiz_id
      and quizzes.created_by = (select auth.uid())
  )
);

create policy "Quiz creators can delete questions"
on public.questions for delete
to authenticated
using (
  exists (
    select 1 from public.quizzes
    where quizzes.id = questions.quiz_id
      and quizzes.created_by = (select auth.uid())
  )
);

create policy "Authenticated users can create options"
on public.options for insert
to authenticated
with check (
  exists (
    select 1
    from public.questions
    join public.quizzes on quizzes.id = questions.quiz_id
    where questions.id = options.question_id
      and quizzes.created_by = (select auth.uid())
  )
);

create policy "Quiz creators can update options"
on public.options for update
to authenticated
using (
  exists (
    select 1
    from public.questions
    join public.quizzes on quizzes.id = questions.quiz_id
    where questions.id = options.question_id
      and quizzes.created_by = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.questions
    join public.quizzes on quizzes.id = questions.quiz_id
    where questions.id = options.question_id
      and quizzes.created_by = (select auth.uid())
  )
);

create policy "Quiz creators can delete options"
on public.options for delete
to authenticated
using (
  exists (
    select 1
    from public.questions
    join public.quizzes on quizzes.id = questions.quiz_id
    where questions.id = options.question_id
      and quizzes.created_by = (select auth.uid())
  )
);
