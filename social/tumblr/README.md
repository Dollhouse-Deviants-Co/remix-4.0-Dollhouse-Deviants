# Tumblr custom theme — @sonja-on-fire

Live blog: https://www.tumblr.com/sonja-on-fire
Title (2026-10-25): Dollhouse Deviants — Sonja on Fire
Bio (Bio A, applied 2026-10-25):
  Full-stack dev • AI systems tinkerer
  💎 Handmade jewelry | Dollhouse Deviants
  Aesthetic archive — captioned, labelled, SFW. Iowa, she/her

## What this is
`tumblr-custom-theme.html` is the versioned backup of the custom theme applied in
Tumblr's Customize editor. It is a social hook / brand integration record: the same
Dollhouse Deviants palette, title, bio, and accessibility rules used on Tumblr can be
reused for other social profiles.

**Live Tumblr editor is the source of truth for the live blog.** This repo copy does
not auto-sync to Tumblr. If Tumblr resets the theme, re-paste this file in
Customize > Edit HTML.

## Palette and type
- Background: near-black #0a0a0a, post background #111111
- Main accent: neon pink #FF1E89 (title, primary links/buttons)
- Secondary accent: cyan #0fb6cb (navigation and tags only)
- Text: off-white #f5f5f5, muted #c9c9c9, borders solid #333333
- Font: system-ui, "Segoe UI", Inter, "Helvetica Neue", Arial, sans-serif.
  No named Dollhouse Deviants brand font was found on file as of 2026-10-25;
  Inter is a generic clean technical sans in the stack, not a claimed brand font.
  No external font file is loaded.

## Rules built into the theme
- HTML + CSS only. No JavaScript, no external scripts, no tracking pixels.
- High contrast, defined solid borders/labels (never color alone), fully usable in
  grayscale, no faint or gradient-only separators, no flashing, no decorative motion,
  prefers-reduced-motion respected.
- Post types: text, photo, photoset, quote, link, chat, audio, video, answer,
  plus captions, tags, dates, reblog source, note counts, pagination.
- No fire/flow content, no adult links, no explicit content in the theme.
- Blog settings live outside this file: title, bio, Asks, comments, and the
  explicit/mature flag are set in Tumblr Blog Settings, not in the theme.

## Brand assets (not in this commit — binaries)
- Sonja Doll circular avatar
- Dollhouse Deviants neon dollhouse scene
- Dollhouse Deviants neon-sign logo — designated Tumblr cover/header photo
These are saved with the social-media-digest files (brand-assets/) and must be
uploaded separately; they are not committed here because this route does not push
binaries.

## Status (2026-10-25)
- Blog audited signed-in: 0 posts, 0 drafts, 0 queue — rework is a from-scratch launch.
- Explicit flag: petition submitted to Tumblr Support 2026-10-25 (category "My blog was
  incorrectly marked as explicit or mature", relevant blog sonja-on-fire). Confirmation
  page: "Got it" — Support will email shortly. No ticket/reference number was shown.
  Flag remains on until Tumblr acts.
