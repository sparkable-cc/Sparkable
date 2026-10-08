import {QueryClient} from '@tanstack/react-query'

import {
  prosocialMetadataQueryKey,
  updateProsocialReactionCache,
} from './prosocial-metadata'

jest.mock('#/env', () => ({
  PROSOCIAL_METADATA_API_HOST: 'https://metadata.sparkable.test',
}))

jest.mock('#/state/session', () => ({
  useAgent: jest.fn(),
}))

const uri = 'at://did:plc:example/app.bsky.feed.post/test'

describe('prosocial metadata optimistic counts', () => {
  it('adds, changes, and removes a reaction immediately', () => {
    const client = new QueryClient()
    const read = () =>
      client.getQueryData(prosocialMetadataQueryKey(uri)) as {
        reactionCounts: {insight: number; compassion: number}
        viewerReaction: string | null
      }

    updateProsocialReactionCache(client, uri, null, 'insight')
    expect(read().reactionCounts.insight).toBe(1)
    expect(read().viewerReaction).toBe('insight')

    updateProsocialReactionCache(client, uri, 'insight', 'compassion')
    expect(read().reactionCounts.insight).toBe(0)
    expect(read().reactionCounts.compassion).toBe(1)

    updateProsocialReactionCache(client, uri, 'compassion', null)
    expect(read().reactionCounts.compassion).toBe(0)
    expect(read().viewerReaction).toBeNull()
  })
})
