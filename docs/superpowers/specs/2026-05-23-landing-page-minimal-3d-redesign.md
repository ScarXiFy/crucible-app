# Landing Page Minimal 3D Redesign

## Context

The current landing page is warm, colorful, and playful. It uses a large gradient hero, rounded UI cards, subject chips, and a bright 3D study-desk illustration. The new direction should follow the supplied minimalist reference more closely: white or near-white space, black editorial typography, sparse navigation, restrained buttons, and sections that breathe.

The approved visual direction is **B. Abstract 3D System** from the visual companion mockups. This keeps Crucible's interactive 3D hero, but changes its character from a literal notebook scene to a minimal black-and-white abstract quiz/review system.

## Goals

- Redesign the root landing page around a minimalist editorial look.
- Keep the landing page useful for Crucible as a quiz and review app.
- Preserve the interactive 3D hero, but replace the colorful desk scene with a monochrome abstract 3D object.
- Use fewer decorative elements, fewer cards, and more open whitespace.
- Keep the page responsive and polished on desktop and mobile.

## Non-Goals

- No authentication, dashboard, quiz, Supabase, or API behavior changes.
- No new design dependency or 3D library unless the current CSS/animejs approach proves insufficient.
- No marketing-heavy landing page with fake metrics, testimonials, or unrelated sections.
- No beige, colorful gradient, or one-note blue/yellow visual system.

## Design Direction

### Visual System

- Palette: true white or very light neutral background, black text, muted gray secondary text, hairline neutral borders.
- Accent: black primary action. Any secondary accent should be extremely restrained, such as soft gray fills or subtle focus states.
- Typography: keep the existing Atkinson Hyperlegible font for consistency, but use it with a more editorial scale and tighter hierarchy. Large hero type should feel direct and spacious, not playful.
- Geometry: sharp or lightly softened edges, 0-8px radius. Avoid rounded-xl/2xl card-heavy styling on the landing page.
- Buttons: rectangular black primary button with uppercase or compact strong label. Secondary actions should read as understated text links with an underline or arrow.

### Header

Use a simple top navigation inspired by the reference:

- Left: minimal Crucible mark and wordmark.
- Right: short text links. Suggested labels: `Start`, `Review`, `Dashboard`, `Login`.
- Keep the header unboxed or with a very light bottom border. No blurred glass treatment.

### Hero

Hero composition should use an editorial two-part layout:

- Left side: large headline, concise supporting copy, primary CTA, and secondary text link.
- Right/lower-right side: abstract interactive 3D system.
- The first viewport should leave a hint of the next section visible on common desktop and mobile heights.

Suggested hero copy:

- Heading: `Study without the noise.`
- Body: `Crucible turns short quizzes into a simple rhythm: topic, answer, result, next review.`
- Primary CTA: `Start a quiz`
- Secondary CTA: `See the loop`

### Interactive 3D Hero

Replace the current colorful notebook/pen scene with a minimal 3D abstract object built from CSS transforms and animated with animejs:

- A central tilted cube or plane representing the current quiz attempt.
- Two thin orbital rings or wireframe tracks representing repeated review.
- Three small nodes representing topic, attempt, and result.
- Pointer movement should subtly tilt or parallax the object.
- Idle animation should be slow and quiet.
- Use black strokes, white surfaces, gray shadows, and no glow/orb decoration.
- It should have an accessible label such as `Interactive abstract quiz review system`.

The component can stay in `src/components/LandingAnimations.tsx` if it remains small. If it becomes too large, split the hero visual into a focused client component while keeping the root page as a Server Component.

### Sections

Keep the page short and intentional:

1. **Hero**: minimal navigation, hero copy, abstract 3D system.
2. **Study Loop**: open three-column explanation of `Topic`, `Attempt`, and `Result`, using small line icons or simple typographic markers rather than cards.
3. **For Learners and Creators**: two-column section explaining student practice and quiz creation with restrained blocks or lists.
4. **Final CTA/Footer**: simple closing action and minimal footer links.

Do not use large rounded cards inside large rounded cards. Prefer open sections with max-width containers, hairline dividers, and well-spaced text.

## Implementation Notes

- Edit primarily `src/app/page.tsx` and `src/components/LandingAnimations.tsx`.
- Keep `LandingAnimations` as the client-only animation boundary.
- Keep root page content as static markup with `next/link`.
- Use Tailwind utility classes already used in the repo.
- Review the local Next.js docs before implementation; the app uses Next.js 16.2.6 with App Router and React 19.
- Avoid touching existing dirty files unrelated to the landing page unless required.

## Verification

- Run lint after implementation.
- Run the dev server and inspect the landing page in a browser.
- Check desktop and mobile responsive layouts.
- Verify the 3D hero is visible, nonblank, interactive on pointer movement, and not overlapping hero copy.
- Verify CTA links still navigate to the intended routes.
- Compare against the approved B direction from the visual companion:
  - black-and-white minimalist palette
  - large editorial hero type
  - sparse navigation
  - abstract 3D system hero
  - open, non-card-heavy downstream sections

## Open Decisions

- The exact logo mark can stay as a refined text/letter mark unless a separate brand pass is requested.
- If the existing Atkinson font feels too friendly after implementation, evaluate typography using weight, scale, and spacing first before adding another font.
