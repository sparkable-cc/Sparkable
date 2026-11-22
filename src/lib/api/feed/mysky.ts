import {type Client} from '@atproto/lex'

import {DISCOVER_FEED_URI, MYSKY_FEED_URI} from '#/lib/constants'
import {logger} from '#/logger'
import {type app} from '#/lexicons'
import {CustomFeedAPI} from './custom'
import {type FeedAPI, type FeedAPIResponse} from './types'

/** Keep the MySky tab usable when its feed generator is unavailable. */
export class MySkyFeedAPI implements FeedAPI {
  mySky: FeedAPI
  discover: FeedAPI
  usingDiscover = false

  constructor({
    client,
    userInterests,
  }: {
    client: Client
    userInterests?: string
  }) {
    this.mySky = new CustomFeedAPI({
      client,
      feedParams: {feed: MYSKY_FEED_URI},
      failOnHttpError: true,
    })
    this.discover = new CustomFeedAPI({
      client,
      feedParams: {feed: DISCOVER_FEED_URI},
      userInterests,
    })
  }

  peekLatest(): Promise<app.bsky.feed.defs.FeedViewPost> {
    return (this.usingDiscover ? this.discover : this.mySky).peekLatest()
  }

  async fetch({
    cursor,
    limit,
    signal,
  }: {
    cursor: string | undefined
    limit: number
    signal?: AbortSignal
  }): Promise<FeedAPIResponse> {
    if (cursor === undefined) this.usingDiscover = false
    if (this.usingDiscover) return this.discover.fetch({cursor, limit, signal})

    try {
      return await this.mySky.fetch({cursor, limit, signal})
    } catch (error) {
      // Switching after page one would mix two feeds and apply a MySky cursor
      // to Discover. Let pagination errors use the normal retry UI instead.
      if (cursor !== undefined) throw error
      logger.warn('MySky unavailable, showing Discover instead', {
        message: String(error),
      })
      const fallback = await this.discover.fetch({
        cursor: undefined,
        limit,
        signal,
      })
      this.usingDiscover = true
      return fallback
    }
  }
}
