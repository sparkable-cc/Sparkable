import {describe, expect, it, jest} from '@jest/globals'

import {PROD_FEEDS, SPARKABLE_FEED_URI} from '#/lib/constants'
import {
  isInteractionAllowed,
  SPARKABLE_FEED_INTERACTIONS,
} from '#/state/feed-feedback'
import {type FeedSourceFeedInfo} from '#/state/queries/feed'

// Only the allowlist is under test; these imports pull in most of the app.
jest.mock('#/state/queries/feed', () => ({isFeedSourceFeedInfo: () => true}))
jest.mock('#/view/com/posts/PostFeed', () => ({getItemsForFeedback: () => []}))
jest.mock('#/analytics', () => ({useAnalytics: () => ({})}))
jest.mock('#/state/session', () => ({useAgent: () => ({})}))

function feedInfo(uri: string) {
  return {uri, feedDescriptor: `feedgen|${uri}`} as FeedSourceFeedInfo
}

const sparkable = feedInfo(SPARKABLE_FEED_URI)
const discover = feedInfo(PROD_FEEDS[0].slice('feedgen|'.length))
const otherFeed = feedInfo(
  'at://did:plc:aaaaaaaaaaaaaaaaaaaaaaaa/app.bsky.feed.generator/other',
)
const moderationEvents = Object.values(SPARKABLE_FEED_INTERACTIONS)

describe('isInteractionAllowed', () => {
  it('sends moderation signals to the Sparkable feed', () => {
    for (const event of moderationEvents) {
      expect(isInteractionAllowed(true, sparkable, event)).toBe(true)
    }
  })

  it('never sends moderation signals to any other feed, Discover included', () => {
    for (const event of moderationEvents) {
      expect(isInteractionAllowed(true, discover, event)).toBe(false)
      expect(isInteractionAllowed(true, otherFeed, event)).toBe(false)
    }
  })

  it('sends nothing when feedback is disabled', () => {
    for (const event of moderationEvents) {
      expect(isInteractionAllowed(false, sparkable, event)).toBe(false)
    }
  })

  it('keeps the existing rules for Bluesky events', () => {
    const showLess = 'app.bsky.feed.defs#requestLess'
    const clickthrough = 'app.bsky.feed.defs#clickthroughItem'
    expect(isInteractionAllowed(true, sparkable, showLess)).toBe(true)
    expect(isInteractionAllowed(true, sparkable, clickthrough)).toBe(false)
    expect(isInteractionAllowed(true, otherFeed, showLess)).toBe(true)
    expect(isInteractionAllowed(true, discover, clickthrough)).toBe(true)
  })
})
