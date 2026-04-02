Generate a conventional commit for the staged/unstaged changes in this project.

1. Run `git diff HEAD` and `git status` to understand all changes.
2. Determine the commit type:
   - `feat` — new feature or component
   - `fix` — bug fix
   - `refactor` — restructuring without behavior change
   - `test` — adding or updating tests
   - `style` — formatting, TailwindCSS class changes
   - `chore` — config, dependencies, build
   - `docs` — CLAUDE.md, ARCHITECTURE.md, README
3. Write a short, imperative subject line in UPPERCASE after the type tag, following the project's existing style: `[TYPE] - description`
   Example: `[ADD] - exercise type modal component`
4. Stage all relevant files (exclude .env files).
5. Create the commit.

Use the project's commit style seen in git log: `[ADD]`, `[FIX]`, `[REFACTOR]` — uppercase tags in brackets.
