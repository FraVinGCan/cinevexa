---
name: Cinevexa
description: A keyable, page-addressed broadcast index for film and television.
colors:
  signal-red: 'oklch(0.444 0.177 26.899)'
  signal-ink: 'oklch(0.971 0.013 17.38)'
  rating-gold: 'oklch(0.802 0.137 84.5)'
  live-blue: 'oklch(0.735 0.105 224.5)'
  fault-red: 'oklch(0.704 0.191 22.216)'
  ground: 'oklch(0.148 0.004 228.8)'
  rail: 'oklch(0.118 0.005 228.8)'
  cell: 'oklch(0.183 0.007 223.9)'
  card: 'oklch(0.218 0.008 223.9)'
  raised-cell: 'oklch(0.248 0.009 223.9)'
  muted-cell: 'oklch(0.275 0.011 216.9)'
  ink: 'oklch(0.987 0.002 197.1)'
  metadata: 'oklch(0.723 0.014 214.4)'
  hairline: 'oklch(1 0 0 / 10%)'
  focus-ring: 'oklch(0.742 0.032 214.4)'
typography:
  display:
    fontFamily: "'Roboto Variable', sans-serif"
    fontSize: '1.875rem'
    fontWeight: 600
    letterSpacing: '-0.025em'
  headline:
    fontFamily: "'Roboto Variable', sans-serif"
    fontSize: '1.125rem'
    fontWeight: 500
    letterSpacing: '-0.025em'
  title:
    fontFamily: "'Roboto Variable', sans-serif"
    fontSize: '1rem'
    fontWeight: 500
  body:
    fontFamily: "'Roboto Variable', sans-serif"
    fontSize: '0.875rem'
    lineHeight: '1.625'
  label:
    fontFamily: "'Roboto Variable', sans-serif"
    fontSize: '0.75rem'
    fontWeight: 500
    letterSpacing: '0.2em'
rounded:
  sm: '0.27rem'
  md: '0.36rem'
  lg: '0.45rem'
  xl: '0.63rem'
  2xl: '0.81rem'
  3xl: '0.99rem'
  4xl: '1.17rem'
  full: '9999px'
spacing:
  '0.5': '0.125rem'
  '1': '0.25rem'
  '1.5': '0.375rem'
  '2': '0.5rem'
  '3': '0.75rem'
  '4': '1rem'
  '6': '1.5rem'
  '8': '2rem'
  '10': '2.5rem'
components:
  button-primary:
    backgroundColor: '{colors.signal-red}'
    textColor: '{colors.signal-ink}'
    typography: '{typography.body}'
    rounded: '{rounded.4xl}'
    height: '2.25rem'
    padding: '0 0.75rem'
  button-outline:
    backgroundColor: '{colors.ground}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.4xl}'
    height: '2.25rem'
    padding: '0 0.75rem'
  button-ghost:
    backgroundColor: 'transparent'
    textColor: '{colors.metadata}'
    typography: '{typography.body}'
    rounded: '{rounded.4xl}'
    height: '2.25rem'
    padding: '0 0.75rem'
  button-destructive:
    backgroundColor: 'oklch(0.704 0.191 22.216 / 10%)'
    textColor: '{colors.fault-red}'
    typography: '{typography.body}'
    rounded: '{rounded.4xl}'
    height: '2.25rem'
    padding: '0 0.75rem'
  badge-score:
    backgroundColor: '{colors.muted-cell}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.3xl}'
    height: '1.25rem'
    padding: '0.125rem 0.5rem'
  badge-score-glyph:
    backgroundColor: 'transparent'
    textColor: '{colors.rating-gold}'
  card:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.4xl}'
    padding: '1.5rem'
  input:
    backgroundColor: '{colors.muted-cell}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.3xl}'
    height: '2.25rem'
    padding: '0 0.75rem'
  tab-list:
    backgroundColor: '{colors.muted-cell}'
    textColor: '{colors.metadata}'
    typography: '{typography.body}'
    rounded: '{rounded.full}'
    height: '2.25rem'
    padding: '0.25rem'
  poster-card:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.4xl}'
    padding: '0.75rem'
  media-card:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.4xl}'
    padding: '0.75rem'
  media-hero:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.4xl}'
    padding: '1.5rem'
  media-rail:
    typography: '{typography.headline}'
    rounded: '{rounded.4xl}'
    width: '9rem'
---

# Design System: Cinevexa

## Overview

**Creative North Star: "The Broadcast Patchbay"**

Every title is a patch point: an addressed cell that carries its own channel. The interface is a frame around a lattice of cells rather than a feed of promoted content — nothing is staged at the top of the page waiting to be admired, and a title's region, provider, and monetisation type are read off the cell, not opened in a dialog. The frame is the design: seven roles do all the work, and every action, active mark, and score sits inside that frame rather than floating above it.

A title enters a page one of two ways, and both are cells. The **split cell** carries one title at the top of a route: artwork on the left, its address and metadata on the right, in a 1.05fr / 1fr split that stays inside the card tone. The **rail** carries many: a strip of addressed cells that scrolls sideways, keeps its own height, and never reflows the page around it. Between them there is no third arrangement — no full-bleed backdrop above undifferentiated poster walls, because a poster wall that never answers where to watch fails the product.

The system is dark-first and tuned for a dark room, a large poster grid, and long horizontal browsing. Density and small-size legibility are functional requirements, not decoration — metadata has to survive at poster-card scale, so the tonal ladder is wide and the type is compact rather than airy. Tactility comes from geometry rather than texture: fully-rounded pills and generous 44 px targets make controls feel pressable, while the surface itself stays flat and quiet so the artwork is the only thing that carries colour and contrast.

Personality is restrained on purpose. There is no decorative chrome, no glow, no gradient text, and no invented visual noise; the character lives in one confident accent colour, an unusually generous radius ladder, and a header band that reads as a channel readout.

**Key Characteristics:**

- Seven-role palette over a five-step tonal ladder; colour is scarce and assigned, never decorative.
- One red, used on every action and active mark, and nowhere else.
- Fully-rounded form language: pills and large-radius tiles, no sharp rectangles.
- Flat by default, with shadows reserved for surfaces that genuinely float.
- Metadata-first density: small tracked labels, muted ink, compact leading.
- Artwork is never tinted, cropped to its cell, and left in its own colour.
- Every title arrives as a cell — one split cell or a rail of cells, never a hero wall.

## Colors

A dark, near-neutral ground carrying one saturated red, a gold reserved for scores, a single cool role for live programming, and a tonal ladder that separates surfaces without outlines doing the work.

### Primary

- **Signal Red** (`oklch(0.444 0.177 26.899)`): every action and every active mark. Primary buttons, the active nav underline, the active tab, the region dot in the header band, the address dot on a split cell, the skip link, and inline links on hover. It is never a background for a large region of a screen and never a decoration.
- **Signal Ink** (`oklch(0.971 0.013 17.38)`): the warm near-white that sits on Signal Red. Used as button text, badge text on red, and the skip-link label. It is never used as a page background.

### Secondary

- **Rating Gold** (`oklch(0.802 0.137 84.5)`): scores, and nothing else — and specifically the star glyph, never the numeral beside it. A TMDB vote average in a single badge treatment. It is not a warning colour, not a highlight, and not a second accent: if something is not a score, it does not get gold.

### Tertiary

- **Live Blue** (`oklch(0.735 0.105 224.5)`): live and currently-airing programming only — airing-today rows, "On the air" rails, a live broadcast state. Nothing else in the interface is cool-coloured.

### Fault

- **Fault Red** (`oklch(0.704 0.191 22.216)`): errors and destructive actions only. It is a distinct hue from Signal Red on purpose — a destructive action is never the primary action, and the two must not be confused.

### Neutral

- **Ground** (`oklch(0.148 0.004 228.8)`): the page. Poster artwork sits directly on it, so it is the darkest large area in the content flow and stays under 15% lightness.
- **Rail** (`oklch(0.118 0.005 228.8)`): the header and footer bands. Deliberately _darker_ than the page, so the frame recedes and the content ground reads as the lit surface.
- **Cell** (`oklch(0.183 0.007 223.9)`): an inset panel — dropdown surfaces, tab lists, input fills, wells.
- **Card** (`oklch(0.218 0.008 223.9)`): a title cell. One step above the ground, never white.
- **Raised Cell** (`oklch(0.248 0.009 223.9)`): the top of the tonal ladder — hover fills on dark surfaces, artwork frames, and the highest-emphasis inset.
- **Muted Cell** (`oklch(0.275 0.011 216.9)`): non-interactive fills — skeletons, empty-state icon wells, inactive tab backgrounds, score badges.
- **Ink** (`oklch(0.987 0.002 197.1)`): primary text.
- **Metadata** (`oklch(0.723 0.014 214.4)`): secondary text — titles, synopses, captions, inactive nav, placeholder text. The most-used colour in the system after the ground.
- **Hairline** (`oklch(1 0 0 / 10%)`): borders, separators, and the 1 px ring on raised surfaces. It is white at 10% in dark mode and a solid pale grey in light mode.
- **Focus Ring** (`oklch(0.742 0.032 214.4)`): the focus treatment, paired with a ring border. Tuned cool and low-chroma so it stays legible on top of poster artwork.

### Light Mode

Light mode ships as a designed theme, not an inversion. Both themes live in `src/css/main.css` as `:root` and `.dark` blocks; the dark values above are normative here because dark is the product's default and primary scene. The light theme deepens every accent so it holds contrast on white — Signal Red to `oklch(0.505 0.213 27.518)`, Rating Gold to `oklch(0.596 0.115 74.5)`, Live Blue to `oklch(0.508 0.116 233.5)`, Fault Red to `oklch(0.577 0.245 27.325)` — flips the hairline to a solid `oklch(0.925 0.005 214.3)`, and inverts the tonal ladder so the ground is white and the header/footer bands are the palest grey. Roles do not change between themes.

### Named Rules

**The One Voice Rule.** Signal Red appears only where something is actionable or currently active. If a red element does not act and does not mark the active item, it is wrong.

**The Score Rule.** Rating Gold is reserved for scores, and it rides the star glyph rather than the numeral. No other element earns gold, in either theme.

**The Uncut Artwork Rule.** TMDB poster, backdrop, profile, and still artwork is never tinted, colour-graded, overlaid with a colour wash, or recoloured to fit the palette. It is cropped to its cell's radius and left alone.

## Typography

**Display Font:** the reserved `font-heading` slot — currently bound to `'Roboto Variable', sans-serif`
**Body Font:** `'Roboto Variable'` (self-hosted via `@fontsource-variable/roboto`), falling back to `sans-serif`
**Label/Mono Font:** none. There is no monospace role in this system.

**Character:** One variable grotesque does all the work, set compact and tightly tracked so titles and metadata survive at poster-card size. Character comes from weight steps and tracked micro-labels rather than from a second family. Numerals in scored data are tabular, so a column of vote averages aligns.

**The Two Voice Rule.** Display and body must resolve to different families. `font-heading` exists as a reserved slot precisely so a second, character-bearing face can land without touching call sites, and no surface may alias `--font-heading` to `--font-sans` as a permanent state. _Outstanding: `--font-heading` is currently aliased to `--font-sans` in `src/css/main.css:9`, so this rule is not yet satisfied in code._

### Hierarchy

- **Display** (600, 1.875rem, tracking -0.025em): the page's one claim. Steps to 2.25rem at the 640 px breakpoint. Its only current use is the split cell's title. One per screen; the header band carries the page's channel label at label scale instead of repeating the title at display scale.
- **Headline** (500, 1.125rem, tracking -0.025em): section and state titles — empty-state titles, the sheet title band, a titled rail's heading.
- **Title** (500, 1rem): a poster cell's title, a nav item, a tab trigger, an alert title. The most common weight in the system.
- **Body** (400, 0.875rem, line-height 1.625): synopses, descriptions, table and list copy. Lede paragraphs step to 1rem at the same relaxed leading. Measures are capped by container, not by width alone: prose blocks cap at 1.5rem-scale column widths rather than running the full 88rem content width, and a synopsis inside a cell is line-clamped rather than allowed to grow the cell.
- **Label** (500, 0.75rem, letter-spacing 0.2em, uppercase): the micro-label that identifies a band, an address, or a group — the header channel readout, the split cell's address, the rail's label, footer column headings, the "Market" group label in a menu. Tracked at 0.12em when it carries a live value such as a region code, and dropped to 0.7rem when it needs supporting copy underneath.
- **Row-cell title** (500, 0.875rem): the compact horizontal cell variant drops one step below Title so a row cell and a poster cell can sit in the same list without competing. This is the only sanctioned step below the Title role, and it exists for row cells only.

### Named Rules

**The Tracked Label Rule.** Uppercase micro-labels are wide-tracked (0.2em) and never longer than four words. They identify a band or a group; they do not announce the heading that follows them.

**The Address Rule.** A tracked label above a title states where the cell is addressed — the channel, the region, the shelf — never what the title is called. "Trending today" over a film's name is an address; the film's genre repeated above its own title is an eyebrow, and an eyebrow is deleted rather than styled.

## Layout

One content column, capped at `max-w-content` (88rem / 1408px) and centred, with page gutters of 1rem on mobile stepping to 1.5rem at the 640 px breakpoint. Pages open with 2.5rem of vertical padding and set their top-level blocks 2.5rem apart, tightening to 0.75rem inside a block. The measured copy sits in a narrower column inside the content width rather than being allowed to run it.

Density is the default. A poster grid is **1 column on mobile, 2 at 640 px, 3 at 1024 px, and 4 at 1280 px**, with a 1rem gutter; the page scaffolding uses the same 1rem step, so a grid of titles and a page of sections share one rhythm.

Horizontal rails are the other primary container and keep their own height so a rail never reflows the page around it. A rail's cells are 9rem wide, stepping to 10rem at 640 px and 11rem at 1280 px, so the number of titles visible changes with the viewport while the cell's internal layout never does. The scroll region snaps per cell, takes a 1rem gap, and ends in 0.5rem of padding to keep its custom scrollbar clear of the cards.

Two structural bands frame every route. The header is a sticky 3.5rem band on the sunken rail tone with a blurred backdrop, holding the mark, the page's channel label, the primary nav, and the region and theme controls — and every control in it is at least 2.75rem tall, so the band reads as a row of physical switches. Below 768 px the inline nav collapses into a left-edge sheet 85vw wide with square outer corners and the region and theme controls pinned to its foot. The footer repeats the sunken rail tone, splits into a 1.5fr / 1fr / 1fr grid at 768 px, and closes with a hairline-divided legal strip carrying TMDB attribution.

## Elevation & Depth

Depth is tonal first and shadow second. Five neutral steps separate every resting surface, and a 1 px hairline ring in white at 5% (10% in dark mode) rides on top of cards, dialogs, menus, and toasts to keep their edges legible against poster artwork. Shadows exist only where a surface genuinely leaves the page: `shadow-lg` on menus, popovers, selects, hover cards, and toasts, and `shadow-xl` on dialogs and sheets. Cards carry `shadow-md` as a resting ambient lift, so a card sits on tone _and_ a soft shadow while nothing else on the page carries one.

Floating menus are the one translucent surface: a 70%-opaque popover fill under a `backdrop-blur-2xl` and `backdrop-saturate-150` layer. That is functional rather than decorative — content scrolls beneath a floating menu, and the blur is what keeps it legible — and the blur is not applied anywhere else.

### Shadow Vocabulary

- **Card rest** (`shadow-md` plus a 1 px hairline ring): a title cell at rest, and the slider thumb.
- **Floating** (`shadow-lg` plus a hairline ring): menus, select lists, popovers, hover cards, toasts.
- **Modal** (`shadow-xl` plus a hairline ring): dialogs and edge sheets.

### Named Rules

**The Flat-By-Default Rule.** Resting surfaces are flat and separated by tone plus a hairline. A shadow means one thing only: this surface is above the page.

**The Shadow Budget Rule.** A surface that is not floating does not get an ambient glow, a coloured halo, or a zero-blur offset shadow. Depth cues are offset and soft-blurred, or they are not depth cues.

## Shapes

The form language is one idea carried through the whole system: nothing interactive is a sharp rectangle. One base radius (`--radius: 0.45rem`) generates a seven-step ladder, and the step is chosen by the surface's size and lifetime rather than by a scale index — the largest, longest-lived surfaces get the largest radius, and transient surfaces get progressively tighter ones.

- **4xl (1.17rem)** — buttons, title cells and every cell sub-part, dialogs, input groups.
- **3xl (0.99rem)** — badges, inputs, menus, selects, popovers, hover cards.
- **2xl (0.81rem)** — alerts, skeletons, toasts, vertical tab triggers.
- **xl (0.63rem)** — tooltips, empty-state icon wells, skeleton bars, the thumbnail inside a row cell.
- **lg (0.45rem)** — the base radius; inline key chips.
- **sm (0.27rem)** — the smallest inline affordance, such as the footer's external link.
- **full** — avatars, nav pills, active tab pills, the active-nav underline bar, the header's channel dot, the split cell's address dot.

Two exceptions are deliberate rather than oversights: edge sheets have square outer corners because they are full-bleed panels rather than floating objects, and the horizontal tab list is a pill while the vertical variant is a 2xl tile. Media cropped to the top or bottom of a card inherits that card's 4xl radius on the cropped edge only, so artwork never breaks the silhouette it sits in; a thumbnail sitting inside a row cell instead of cropping it takes the xl step, because it is nested rather than cropped.

## Components

### Buttons

- **Shape:** fully rounded pill (1.17rem), never a rounded rectangle.
- **Primary:** Signal Red fill with Signal Ink text, 2.25rem tall, 0.75rem horizontal padding, 0.375rem gap between an icon and its label. The large step is 2.5rem with 1rem padding; the small step is 2rem.
- **Hover / Focus:** the primary fill drops to 80% opacity on hover and depresses 1 px on press; focus takes a ring-coloured border plus a 3 px ring at 30% opacity. Focus always replaces, never stacks on top of, the resting border.
- **Secondary / Ghost / Destructive:** outline is a border over the page ground and fills with the muted tone on hover; ghost has no resting fill at all and is the default for icon controls in the header; destructive is a 10% fault-red fill with fault-red text and carries its own focus ring.
- **Touch target:** a control placed in a dense band — the header, a split cell's action row, a footer link — is lifted to 2.75rem even where its type step is smaller. The height, not the type, is what makes it pressable.
- **Icons:** drawn from one library at a single stroke and weight, 1rem by default, 0.75rem in the smallest step. Never a glyph or an emoji.

### Chips

- **Style:** a 3xl pill, 1.25rem tall, muted-cell fill, 0.5rem inline padding, with a 0.75rem label and a 0.75rem icon.
- **State:** a score chip wears Ink on its numeral and Rating Gold on its star glyph. Every other chip wears ink or metadata. Chips are never the primary action — a chip that needs to be pressed becomes a button.

### Cards / Containers

- **Corner Style:** 4xl on the card and on each of its parts, so nested parts never show a seam.
- **Background:** the card tone, one step above the ground.
- **Shadow Strategy:** `shadow-md` with a 1 px hairline ring — the resting ambient lift described in Elevation & Depth.
- **Border:** no border. The hairline ring is the edge.
- **Internal Padding:** 1.5rem vertically and horizontally by default, dropping to 1rem at the small size; a leading or trailing image removes the padding on the edge it touches.

### The Split Cell

The one title a route leads with. It is a card split into two columns at 768 px — 1.05fr of artwork beside 1fr of address and metadata — and it collapses to stacked artwork over copy below that.

- **Artwork:** the backdrop at 16:9, edge-to-edge on the left, full height on the right once split, cropped to the card's 4xl radius on the outer edge only. Never a full-bleed backdrop behind the copy.
- **Address:** a Signal Red dot and a tracked label naming the channel the title is drawn from.
- **Title:** the Display role, the page's single claim, linking to the title's own surface.
- **Metadata:** the score chip and a release/language caption, then a three-line clamped synopsis.
- **Action:** a large primary button, lifted to 2.75rem, with any secondary action beside it.

### Poster Cells

The cell that carries a title in a grid or a rail. Poster first, caption below, in one 4xl card.

- **Artwork:** a 2:3 poster filling the card's top edge, with intrinsic width and height always set so the cell never reflows as the image lands.
- **Caption:** 0.75rem padding, a title clamped to two lines against a fixed 2.75rem block so every cell in a row is the same height, then the score chip and the year pushed to the bottom edge.
- **State:** hover lifts the fill to the raised-cell tone; focus takes the ring treatment. Artwork is never scaled or zoomed on hover.

### Row Cells

The horizontal variant for a vertical list: a 3.5rem-wide 2:3 thumbnail at the xl radius, the title and year beside it, and the score chip trailing at the opposite edge. The whole row is one link, so it takes the card's hover and focus treatment as a single target.

### Rails

A labelled band of cells that scrolls sideways.

- **Label:** a tracked label, optionally over a Headline heading, with a "See all" link pushed to the trailing edge.
- **Scroll region:** snap per cell on the x axis, 1rem gaps, momentum contained, and a hand-drawn scrollbar 0.375rem tall with a 35%-opacity muted thumb on a transparent track. The scroll region is focusable and takes the ring treatment, because a horizontally scrolling region that cannot be reached by keyboard is not navigable.
- **Height:** a rail's height is set by its tallest cell and never changes as cells scroll.

### Artwork Frames

Every image sits in a frame rather than on the page.

- **Frame:** a raised-cell fill behind the image, so a slow or absent image is never a hole in the layout.
- **Missing artwork:** a designed placeholder — the app mark at 40% opacity centred in the frame — never a broken image, an icon glyph, or a collapsed card.
- **Loading:** a skeleton in the muted tone occupies the frame at the exact aspect ratio the image will take, and the image fades in over 300 ms from zero opacity rather than popping.

### Inputs / Fields

- **Style:** a 3xl pill, 2.25rem tall, a 50%-opacity muted fill, and no border at rest — the fill is the boundary.
- **Focus:** a ring-coloured border plus a 3 px ring at 30% opacity, and the fill holds rather than darkening.
- **Error / Disabled:** an invalid field takes the fault-red border and a 20% fault-red ring; disabled drops to 50% opacity and stops taking pointer events. Placeholder text is Metadata, never a lighter grey.

### Navigation

- **Style:** a sticky 3.5rem band on the sunken rail tone at 92% opacity with a backdrop blur and a single hairline bottom border.
- **Typography:** nav items are 0.875rem at weight 500; the page's own channel readout is a label-scale tracked uppercase in Metadata, preceded by a 0.375rem Signal Red dot that marks the live page.
- **Default / Hover / Active:** items sit in full pills at 2.75rem; inactive items are Metadata and brighten to Ink on hover; the active item is Signal Red with a 2 px Signal Red underline inset from the pill's edges — one accent, used twice, in the same place.
- **Mobile:** below 768 px the nav moves into a left-edge sheet, 85vw wide and capped at the small container, with square outer corners, a hairline-divided title band, full-width nav rows at 2.75rem, and the region and theme controls pinned to the foot.

### Menus and Popovers

- **Floating surfaces** — menus, select lists, hover cards — are 3xl, sit at 70% fill under a 2xl backdrop blur with saturation lift, and carry a hairline ring plus `shadow-lg`. Menu items highlight with a 10% ink wash rather than a fill change, separators are a 20% ink wash, and the menu never closes on hover.

### Tabs

- **Shape:** a full pill (2.25rem tall) for horizontal tabs; a 2xl tile when vertical.
- **State:** the active trigger lifts onto the page ground (a 30% input fill in dark mode) with full-strength ink text, and a 2 px underline bar sits 5 px below the list on the line variant. Inactive triggers are 60% ink.

### Feedback Surfaces

- **Error:** a 2xl alert on the card tone with fault-red text, a 0.625rem icon gutter, a title and a description, and a row of actions — a bordered retry and a ghost escape route. An error state always offers the way out, never only the news.
- **Empty:** a dashed 2xl border, a centred column capped at the small container, an optional 2.5rem icon in a muted-cell well, a headline, a description, and a content row that must contain the next action.
- **Loading:** skeletons in the muted tone at 2xl, pulsing, each set marked `aria-busy` with a screen-reader label naming what is loading.

### Named Rules

**The Mirror Rule.** A skeleton reproduces the final layout's box, aspect ratio, and corner exactly — a poster skeleton is a 2:3 cell, a cell skeleton reserves the same fixed-height title block, and a split-cell skeleton rebuilds the same two-column grid. Nothing shifts when content lands, so a skeleton that does not match its surface is a defect rather than a placeholder.

**The Frame Rule.** An image never sits directly on the ground. It sits in a raised-cell frame with intrinsic dimensions and a designed placeholder, so artwork is always cropped to its cell rather than discovering its own size.

## Do's and Don'ts

### Do:

- **Do** keep to the seven-role frame: four tonal neutrals, one red, one gold, one cool. A new colour is a change to the system, not a local choice.
- **Do** read a title's region, provider, and monetisation type off the cell itself, as a caption line beneath the score rather than as a button that opens a dialog.
- **Do** hold poster cells at a 2:3 aspect ratio at every breakpoint, so a grid never reflows as images load.
- **Do** keep every interactive element at a 2.75rem minimum height or width with a visible focus ring and an accessible name.
- **Do** deepen every accent when designing against the light ground; light mode is a theme, not an inversion.
- **Do** give every loading, error, and empty state a next action.
- **Do** give a missing poster a designed placeholder rather than a broken image or a collapsed card.
- **Do** keep a rail's height fixed by its tallest cell, and keep its scroll region reachable by keyboard.

### Don't:

- **Don't** add a gold element that is not a score, or a cool element that is not live programming. Gold rides the star glyph, never the numeral.
- **Don't** use the destructive red for a primary action, or the primary red for an error. They are different hues for a reason.
- **Don't** tint, grade, or overlay TMDB artwork. Crop it to the cell and leave its colour alone.
- **Don't** open a provider lookup in a modal when the cell can carry it. Providers are part of the answer, not a dialog.
- **Don't** build a page around a full-bleed backdrop hero above undifferentiated poster rails. That arrangement is the streaming app's, and it is the visual anti-reference for this system.
- **Don't** put a tracked label above a title to describe that title. It is the cell's address, and a label that only repeats the heading beneath it is deleted.
- **Don't** introduce a second score treatment or a second body size for metadata.
- **Don't** invent surface content — no testimonials, usage counts, ratings, or TMDB-derived statistics that the API does not return.
