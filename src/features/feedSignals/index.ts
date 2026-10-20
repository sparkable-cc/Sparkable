import {SPARKABLE_FEED_URI} from '#/lib/constants'
import {useFeedFeedbackContext} from '#/state/feed-feedback'
import {useAgent} from '#/state/session'
import {type FeedSignal, sparkableFeedProxy} from './signals'

export {
  armMutedWordSignal,
  disarmMutedWordSignal,
  FEED_SIGNALS,
  type FeedSignal,
  onMutedWordSaved,
} from './signals'

/**
 * Returns a function that tells Sparkable's feed about a private post-menu
 * action on this post. It does nothing unless the post is being read in
 * Sparkable's own feed. Sent right away rather than through Bluesky's
 * feed-feedback queue, so Bluesky's code needs no changes.
 */
export function useSendFeedSignal({
  postUri,
  feedContext,
  reqId,
}: {
  postUri: string
  feedContext?: string
  reqId?: string
}) {
  const agent = useAgent()
  const feedFeedback = useFeedFeedbackContext()

  return (signal: FeedSignal) => {
    const proxyDid = sparkableFeedProxy(feedFeedback)
    if (!proxyDid) return
    agent.app.bsky.feed
      .sendInteractions(
        {
          interactions: [{item: postUri, event: signal, feedContext, reqId}],
          feed: SPARKABLE_FEED_URI,
        },
        {
          encoding: 'application/json',
          headers: {'atproto-proxy': `${proxyDid}#bsky_fg`},
        },
      )
      // Best effort, like Bluesky's own feed feedback.
      .catch(() => {})
  }
}
