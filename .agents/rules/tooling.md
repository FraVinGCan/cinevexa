# Tooling

Reach for the MCP servers and skills below whenever the task calls for them, and verify UI in the browser with Playwright instead of asserting that it works.

## Source shadcn/ui components through the MCP

Applies to: `src/components/ui/**`

Add and update shadcn/ui components with the `shadcn` MCP — its add commands, registry search, and component metadata. Never hand-write a registry component.

Files under `src/components/ui/**` are project source: they are committed, customized, and edited like any other component. Source them through the MCP, then adapt them freely.

## Verify React APIs against the docs

Applies to: `src/**`

Confirm React, React Router, and React DOM APIs against the `react-docs` MCP before relying on them. Do not code from memory for behavior or hooks that changed across React 19 or React Router 8.

## Use the Zod MCP for schema questions

Applies to: `src/**`

Answer Zod questions with the `inkeepMcp` MCP so validation schemas target Zod 4 APIs.

## Get approval before adding dependencies

Applies to: `package.json`, `components.json`, `vite.config.ts`

Check `package.json` for an existing library before introducing another. Get the user's approval before adding or upgrading any dependency, and use the `shadcn` MCP's add command so the dependency change it implies surfaces for approval. Keep `components.json` and the Tailwind theme tokens in sync with the installed stack.

## Load a skill when a task matches it

Applies to: `**`

Load the matching skill from `.agents/skills/` with the `skill` tool, by name, when a task fits its scope:

- `impeccable` — UI design, critique, polish passes, and visual QA.
- `ui-styling` — component construction with shadcn/ui and Tailwind.
- `ui-ux-pro-max` — palettes, fonts, and UX guidance.
- `design-system` — design tokens and component specs.
- `design` — brand, logo, icon, banner, and mockup design.
- `brand` — brand voice, visual identity, and messaging.
- `banner-design` — banners, covers, and hero art.
- `slides` — HTML presentations and Chart.js visualizations.
- `tanstack-ai` — AI chat, streaming, tool calling, and agents.
- `tanstack-ai-migration` — moving to or off TanStack AI, or off a deprecated API.

Verify UI in the browser with Playwright instead of asserting that it works.
