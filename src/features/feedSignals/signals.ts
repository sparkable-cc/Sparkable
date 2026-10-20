import {SPARKABLE_FEED_URI} from '#/lib/constants'
import {type StateContext} from '#/state/feed-feedback'

/**
 * Private post-menu actions that Sparkable's feed uses as negative signals.
 * Bluesky never sends these to feeds, so they use Sparkable's own names.
 * "Show more" and "show less" already reach feeds through Bluesky's code.
 */
export const FEED_SIGNALS = {
  muteThread: 'cc.sparkable.feed.defs#muteThread',
  muteWords: 'cc.sparkable.feed.defs#muteWords',
  hidePost: 'cc.sparkable.feed.defs#hidePost',
  muteAccount: 'cc.sparkable.feed.defs#muteAccount',
  blockAccount: 'cc.sparkable.feed.defs#blockAccount',
  reportPost: 'cc.sparkable.feed.defs#reportPost',
} as const

export type FeedSignal = (typeof FEED_SIGNALS)[keyof typeof FEED_SIGNALS]

/**
 * The feed service DID to send signals to, or null when the post is not
 * being read in Sparkable's own feed (or feedback is off, as when logged out
 * or in a thread). This is the only gate: signals never go anywhere else.
 */
export function sparkableFeedProxy(
  feedFeedback: Pick<StateContext, 'enabled' | 'feedSourceInfo'>,
): string | null {
  const feed = feedFeedback.feedSourceInfo
  if (!feedFeedback.enabled || feed?.type !== 'feed') return null
  if (feed.uri !== SPARKABLE_FEED_URI) return null
  return feed.view?.did ?? null
}

/*
 * The muted words dialog is shared by the whole app, so it doesn't know which
 * post opened it. The post menu leaves a one-time callback here; the dialog
 * runs it only when a word is actually saved, and drops it on close.
 */
let pendingMutedWordSignal: (() => void) | null = null

/**
 * Called by the post menu before it opens the muted words dialog.
 */
export function armMutedWordSignal(send: () => void) {
  pendingMutedWordSignal = send
}

/**
 * Called by the muted words dialog after a word is saved.
 */
export function onMutedWordSaved() {
  pendingMutedWordSignal?.()
  pendingMutedWordSignal = null
}

/**
 * Called when the muted words dialog closes.
 */
export function disarmMutedWordSignal() {
  pendingMutedWordSignal = null
}
