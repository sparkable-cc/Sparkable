# Home screen prompt

Sparkable-only feature. A small card that suggests adding Sparkable to the
phone's home screen, where it opens full screen like an app.

## When it appears

All of these must be true (`rules.ts`):

- A phone or tablet browser (iOS or Android), not a computer.
- Not a browser built into another app (LinkedIn, Instagram, Facebook, TikTok,
  X and others). Those can't add anything to the home screen.
- Not already running from the home screen.
- Signed in, from the second visit on (a visit is a browser session).
- Not closed with "Not now" in the last 30 days, and never after the second
  "Not now".
- Not already installed, and the steps weren't already followed.
- At most once per visit, after 30 seconds on the home feed (`/`), and never on
  top of a dialog, the composer or onboarding.

## What "Add" does

| Browser | Behavior |
| --- | --- |
| Chromium on Android (Chrome, Samsung Internet, Edge, Opera) | Opens the browser's own install window. Only shown once the browser has fired `beforeinstallprompt`, which also means it isn't installed yet. |
| Every browser on iOS and iPadOS | Shows Share-menu steps. Safari 26+ gets the ••• menu and the "Open as Web App" switch. |
| Firefox on Android | Shows browser-menu steps. Firefox never fires `beforeinstallprompt`. |

On iOS the home screen app has its own storage, separate from Safari, so it
starts signed out. The steps say so.

## Testing on a phone

Add `?homeScreenPrompt=1` to the URL (for example `https://sparkable.cc/?homeScreenPrompt=1`).
The card then appears after a second, ignoring the sign-in, visit and timing
rules. It still won't appear in another app's browser or when opened from the
home screen.

To reset a phone, clear the site's data or remove the
`sparkable.homeScreenPrompt` key from local storage.

## Analytics

Umami events (allowed in `#/analytics/metrics/umami`), with no personal data:
`homeScreenPrompt:shown`, `:dismissed`, `:addPressed`, `:installChoice`,
`:stepsDone`, `:installed` (Android only), and `app:openedFromHomeScreen`,
which is the only way to see whether iOS users added the app.

## Theme color

`ThemeColorSync` keeps the `theme-color` meta tag at the app's background
color, which sets the browser toolbar and the home screen app's status bar.

## Upstream (Bluesky) touch points

Kept small so merges from Bluesky's social-app stay easy:

- `src/view/shell/index.web.tsx`: one import and `<HomeScreenPrompt />`.
- `src/analytics/metrics/umami.ts` (Sparkable file): allowed event names.
- `bskyweb/cmd/bskyweb/server.go` and `bskyweb/templates/base.html` (both
  already Sparkable-modified): manifest icons, `theme-color`,
  `apple-mobile-web-app-title`.
- Icons come from `scripts/generateBrandIcons.mjs`.

The card's position mirrors `FABInner` (the floating compose button), so it
sits just above it. If Bluesky moves that button, adjust `bottom` in
`index.web.tsx`.

## Things to recheck over time

- iOS changes Safari's menus most Septembers. Check the steps after each major
  iOS release.
- Browser support for `beforeinstallprompt` and the install criteria.
