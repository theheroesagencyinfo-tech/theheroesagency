# Pen cursor across the website

## What changes
- The normal mouse arrow becomes a small fountain-pen cursor on every page, with the nib tip as the click point.
- Links and buttons get the same pen cursor, slightly tilted or in the accent green, so visitors can still tell when something is clickable.
- Text boxes keep the usual typing cursor so filling in forms still feels normal.
- Phones and tablets are unchanged, because they have no cursor.

## Technical details
- Add two small SVG pen cursors (default + pointer variant) to `public/cursors/`, drawn in ink navy with a light outline so they show in both light and dark mode.
- In `src/styles.css`: `body { cursor: url(/cursors/pen.svg) 2 30, auto; }` and `a, button, [role=button], label, select { cursor: url(/cursors/pen-pointer.svg) 2 30, pointer; }`; inputs/textarea keep `cursor: text`.
- Fallbacks (`auto`/`pointer`) ensure normal cursors if the file fails to load. Absolute path works on Vercel too since it's in `public/`.
