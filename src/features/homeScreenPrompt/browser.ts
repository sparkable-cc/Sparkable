import {useSyncExternalStore} from 'react'

import {trackUmamiEvent} from '#/analytics/metrics/umami'
import {parsePlatform} from './platform'
import {updateRecord} from './storage'

/*
 * Web-only browser state, captured when the module loads. The shell imports
 * this feature at startup, which matters for `beforeinstallprompt`: Chrome can
 * fire it soon after the page loads, long before the card is due.
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{outcome: 'accepted' | 'dismissed'}>
}

export const PLATFORM = parsePlatform(
  navigator.userAgent,
  navigator.maxTouchPoints || 0,
)

/**
 * Running from the home screen. `navigator.standalone` covers iOS versions
 * whose Safari doesn't report the display mode.
 */
export const IS_STANDALONE =
  ['standalone', 'fullscreen', 'minimal-ui'].some(
    mode => window.matchMedia?.(`(display-mode: ${mode})`).matches,
  ) || (navigator as Navigator & {standalone?: boolean}).standalone === true

/**
 * `?homeScreenPrompt=1` shows the card right away, ignoring the timing and
 * sign-in rules, so it can be tested on real phones.
 */
export const IS_FORCED =
  new URLSearchParams(window.location.search).get('homeScreenPrompt') === '1'

let deferredPrompt: BeforeInstallPromptEvent | undefined
const listeners = new Set<() => void>()
const notify = () => listeners.forEach(listener => listener())

window.addEventListener('beforeinstallprompt', event => {
  // Stops Chrome's own mini-infobar so the card decides the timing
  event.preventDefault()
  deferredPrompt = event as BeforeInstallPromptEvent
  notify()
})

window.addEventListener('appinstalled', () => {
  deferredPrompt = undefined
  updateRecord(() => ({done: true}))
  trackWhenReady('homeScreenPrompt:installed', {})
  notify()
})

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * Whether the browser has offered its install window.
 */
export function useCanInstall() {
  return useSyncExternalStore(subscribe, () => deferredPrompt !== undefined)
}

/**
 * Opens the browser's install window. It can only be used once, so the
 * deferred event is cleared afterwards.
 */
export async function promptInstall(): Promise<
  'accepted' | 'dismissed' | 'unavailable'
> {
  const event = deferredPrompt
  if (!event) return 'unavailable'
  deferredPrompt = undefined
  notify()
  try {
    await event.prompt()
    const {outcome} = await event.userChoice
    return outcome
  } catch {
    return 'unavailable'
  }
}

/**
 * Umami's script loads separately, so events sent at startup can arrive
 * before it does. Retries for a few seconds instead of dropping them.
 */
export function trackWhenReady(event: string, payload: Record<string, string>) {
  let attempts = 0
  const attempt = () => {
    const umami = (globalThis as {umami?: {track?: unknown}}).umami
    if (umami?.track) {
      trackUmamiEvent(event, payload)
    } else if (attempts++ < 15) {
      setTimeout(attempt, 1000)
    }
  }
  attempt()
}
