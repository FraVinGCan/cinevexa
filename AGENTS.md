# Repository Agent Rules

These rules apply throughout this repository.

## Boundaries

- Treat this repository as a movie and TV discovery web app.
- Do not start, stop, restart, or otherwise manage the frontend development servers unless the user explicitly requests it.
- Do not run `npm run dev` unless the user explicitly requests it. Inform me if the implementation requires restarting.
- Run Git commands only for read-only inspection. Do not commit, amend, stage, reset, restore, checkout, rebase, merge, push, pull, or change branches unless the user explicitly requests it.
- Preserve existing user changes. Do not revert, overwrite, or delete unrelated work.
- Never hand-edit build output, vendored dependencies, or other generated artifacts: `dist/`, `node_modules/`, coverage, and lockfiles. Fix the tool that produces them instead.
- Get the user's approval before changing dependencies, including npm packages, project-wide tooling, or the base directory structure. Check `package.json` for an existing library first, and keep `components.json` and the Tailwind theme tokens in sync with the installed stack.
- Do not create, update, move, or delete anything under `docs/plans/` unless the user explicitly requests it.

## Before Editing

- At the start of a session, read relevant `docs/` guidance, review recent Git history, and inspect staged and unstaged changes before editing.
- Read and follow the `AGENTS.md` before changing files.
- Read and follow the rules in `.agents/rules/` — they encode settled project conventions, traps, and constraints that must always be respected.
- Follow the established conventions in the files surrounding the change.
- Keep changes scoped to the user's request.
- Always use the MCP servers and skills below when the task calls for them.
- If a fix fails, remove or revise stale changes created for that failed approach before trying another.

## MCPs

- Verify React, React Router, and React DOM APIs against the `react-docs` MCP. Do not code from memory for behavior or hooks that changed across React 19 or React Router 8.
- Source shadcn/ui components through the `shadcn` MCP — its add commands, registry search, and component metadata.
- Answer Zod questions with the `inkeepMcp` MCP so validation schemas target Zod 4 APIs.
- Use the `shadcn` MCP's add command for every component addition so the dependency change it implies surfaces for approval.
- Use subagents for open-ended searches and purpose-built project tooling whenever it fits the task.

## Skills

- Load a skill with the `skill` tool when the task matches its scope. Skills live in `.agents/skills/`; load by name, not by reading `SKILL.md` directly.
- Available skills: `impeccable`, `ui-styling`, `ui-ux-pro-max`, `design-system`, `design`, `brand`, `banner-design`, `slides`, `tanstack-ai`, `tanstack-ai-migration`.
- Load `impeccable` for UI and design work, including critique and polish passes.

## Tools

- At the start of any session that touches design, run `impeccable context` before other work — `.agents/skills/impeccable/scripts/impeccable.cmd context` on this shell — and run `impeccable doctor` when it reports `CONTEXT_STALE`.
- Verify UI in the browser with Playwright instead of asserting that it works. Take screenshots, scan for defects, and fix them in bounded passes rather than open-ended iteration.
- Run Git commands for inspection only, and report checks that could not be run.

## Validation

- Validate changes in proportion to their risk, using the narrowest relevant checks first.
- Follow any formatter, test, and verification requirements.
- Format code with `npx prettier --write <files>`.
- Report checks that were run and any checks that could not be run.

## Documentation

- Keep this file limited to agent behavior and repository constraints.
- Put new architecture, setup, operational, and product documentation in `docs/`; keep README files limited to project entry-point information.
- Do not edit `.env`; use `.env.example`, config files, `docs/`, or deployment variables instead.
- `PRODUCT.md` and `DESIGN.md` live at the repository root, not in `docs/`, because the `impeccable` skill resolves those paths at the root. Relocating them breaks its context loader.
- Keep documentation in sync with changes: when work affects behavior, setup, conventions, or entry points, update the relevant file as needed — `README.md` for project entry-point info, `docs/` for architecture/setup/operational guidance, `.agents/rules/` for conventions and traps, `AGENTS.md` for agent behavior rules. Update only what the change affects; do not pad unrelated documentation.
- Write documentation, rules, `AGENTS.md`, and `README.md` in the present tense and as normative statements of the current state — never as history ("was removed", "formerly", "previously", "we migrated"). When something is obsolete, delete or replace the stale reference; do not chronicle it.

## Recording Project Rules

When the user states a durable project rule or convention — "we always do X", "never use Y", or names a settled decision — record it proactively, without waiting to be asked:

- **Product, architecture, setup, or operational facts** → `docs/` (committed and shared).
- **Agent behavior, code conventions, and traps** → `.agents/rules/<area>/`.

Every note:

- is a few lines, titled by the convention;
- declares the files it applies to with a glob line (`Applies to: src/components/**`);
- **is updated in place when restated** — never add a duplicate note for a rule you already recorded.

Do not record secrets, transient state, or anything already obvious from the code. `.agents/rules/` is committed and shared with teammates, so record conventions there directly. `docs/` stays for product, architecture, setup, and operational documentation.
