# Faded writer's desk banner behind the homepage headline

## What changes
- The uploaded "writer's desk at golden hour" photo goes behind the first section of the homepage and fills its full width.
- The photo shows at about 25% strength. The paper-white background covers the other 75%, so the headline, text and buttons stay just as easy to read as they are now.
- The text keeps its current position, size and colours, and sits on top of the photo.
- The photo is decorative. Screen readers skip it, and the page layout stays the same on phones and desktop.
- In dark mode the photo fades into the navy background in the same way.
- Nothing else on the site changes.

## Technical details
- Upload the image with lovable-assets to `src/assets/banner-writers-desk.png.asset.json` and import its `.url`.
- In `src/routes/index.tsx`, the hero `<section>` becomes `relative overflow-hidden` and full width. It gets an absolutely positioned `<img alt="" aria-hidden>` set to `object-cover opacity-25`, and the existing content goes inside a `relative` max-w-6xl wrapper.
- No og:image tag, because the asset URL is relative.
- Check light and dark mode at 1280 and 393 widths with Playwright, and confirm the text contrast still passes.
- Mark the banner item in roadmap.md as done.
