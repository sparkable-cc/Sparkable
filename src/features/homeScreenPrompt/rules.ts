import {type HomeScreenPlatform} from './platform'

/**
 * How the card helps someone add Sparkable:
 * - `install`: the browser's own install window (Chromium on Android)
 * - `ios-steps`: instructions for the Share menu (every browser on iOS)
 * - `android-steps`: instructions for the browser menu (Firefox on Android)
 */
export type PromptMethod = 'install' | 'ios-steps' | 'android-steps'

/**
 * Stored per device, so it outlives sign-out and account switches.
 */
export type PromptRecord = {
  /**
   * Browser sessions started on this device.
   */
  visits: number
  /**
   * Times the card was closed with "Not now".
   */
  dismissCount: number
  lastDismissedAt?: number
  /**
   * Set once the person installed Sparkable or followed the steps. We can't
   * tell whether the steps worked on iOS, so we stop asking either way.
   */
  done?: boolean
}

export const EMPTY_RECORD: PromptRecord = {visits: 0, dismissCount: 0}

/**
 * The card first appears from the second visit on.
 */
export const MIN_VISITS = 2

/**
 * After the second "Not now", the card doesn't come back on its own.
 */
export const MAX_DISMISSALS = 2

export const DISMISS_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000

/**
 * Returns how this browser can add Sparkable to the home screen, or undefined
 * when the card shouldn't appear at all.
 */
export function getPromptMethod({
  platform,
  standalone,
  canInstall,
}: {
  platform: HomeScreenPlatform
  /**
   * Already running from the home screen.
   */
  standalone: boolean
  /**
   * The browser offered its install window (`beforeinstallprompt`).
   */
  canInstall: boolean
}): PromptMethod | undefined {
  if (standalone || platform.inAppBrowser) return undefined
  if (platform.os === 'ios') return 'ios-steps'
  if (platform.os === 'android') {
    if (canInstall) return 'install'
    /*
     * Chromium browsers that don't offer the install window either already
     * have Sparkable installed or don't consider it installable, so stay quiet.
     * Firefox never offers the window but has an install item in its menu.
     */
    if (platform.browser === 'firefox') return 'android-steps'
  }
  return undefined
}

/**
 * Whether the person is due to see the card, based on what they did before.
 */
export function isPromptDue({
  record,
  signedIn,
  now,
}: {
  record: PromptRecord
  signedIn: boolean
  now: number
}): boolean {
  if (!signedIn || record.done) return false
  if (record.visits < MIN_VISITS) return false
  if (record.dismissCount >= MAX_DISMISSALS) return false
  if (
    record.lastDismissedAt !== undefined &&
    now - record.lastDismissedAt < DISMISS_COOLDOWN_MS
  ) {
    return false
  }
  return true
}

/**
 * Which instructions to show on iOS. Safari 26 moved Share into the ••• menu,
 * and its "Add to Home Screen" sheet gained an "Open as Web App" switch.
 */
export function getIosSteps(platform: HomeScreenPlatform) {
  const modernSafari =
    platform.browser === 'safari' && (platform.safariVersion ?? 0) >= 26
  return {shareInMoreMenu: modernSafari, openAsWebAppSwitch: modernSafari}
}
