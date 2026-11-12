import {type AtpAgent} from '@atproto/api'
import {app} from '@bsky/sdk/lexicons'
import {main as reactionRecord} from '@sparkable/prosocial-contract'

import {createLexClient} from '#/lib/lexClient'
import {
  createReactionWithSpark,
  deleteReactionWithSpark,
  putReaction,
} from './prosocial-reactions'

// The published contract is ESM-only. Jest's native test runner resolves a
// virtual contract here so these tests can exercise the write orchestration.
jest.mock(
  '@sparkable/prosocial-contract',
  () => ({
    main: {nsid: 'cc.sparkable.feed.reaction'},
    rkeyForSubjectUri: () => 'reaction-key',
  }),
  {virtual: true},
)
jest.mock(
  '@bsky/sdk/lexicons',
  () => ({app: {bsky: {feed: {like: {main: {nsid: 'app.bsky.feed.like'}}}}}}),
  {virtual: true},
)
jest.mock('#/lib/lexClient', () => ({createLexClient: jest.fn()}))

const subject = {
  uri: 'at://did:plc:author/app.bsky.feed.post/post1',
  cid: 'bafytestpost',
}
const likeUri = 'at://did:plc:viewer/app.bsky.feed.like/like1'
const agent = {
  did: 'did:plc:viewer',
  fetchHandler: jest.fn(),
} as unknown as AtpAgent

function makeClient(results: unknown[] = []) {
  const create = jest.fn((lexicon, value, options) => ({
    kind: 'create',
    lexicon,
    value,
    options,
  }))
  const del = jest.fn((lexicon, options) => ({
    kind: 'delete',
    lexicon,
    options,
  }))
  const applyWrites = jest.fn(
    (build: (ops: {create: typeof create; delete: typeof del}) => unknown) =>
      Promise.resolve({
        body: {results},
        writes: build({create, delete: del}),
      }),
  )
  const put = jest.fn(() => Promise.resolve(undefined))
  jest
    .mocked(createLexClient)
    .mockReturnValue({applyWrites, put} as unknown as ReturnType<
      typeof createLexClient
    >)
  return {applyWrites, create, del, put}
}

beforeEach(() => jest.clearAllMocks())

describe('prosocial repository writes', () => {
  it('creates the reaction and its Spark in one commit', async () => {
    const client = makeClient([{uri: likeUri}])

    await expect(
      createReactionWithSpark({agent, subject, reactionType: 'insight'}),
    ).resolves.toEqual({likeUri})

    expect(client.applyWrites).toHaveBeenCalledTimes(1)
    expect(client.create).toHaveBeenNthCalledWith(
      1,
      reactionRecord,
      expect.objectContaining({reactionType: 'insight', subject}),
      {rkey: 'reaction-key'},
    )
    expect(client.create).toHaveBeenNthCalledWith(
      2,
      app.bsky.feed.like.main,
      expect.objectContaining({subject}),
    )
  })

  it('changes the deterministic reaction record without writing a Spark', async () => {
    const client = makeClient()

    await putReaction({agent, subject, reactionType: 'compassion'})

    expect(client.put).toHaveBeenCalledWith(
      reactionRecord,
      expect.objectContaining({reactionType: 'compassion', subject}),
      {rkey: 'reaction-key'},
    )
    expect(client.applyWrites).not.toHaveBeenCalled()
  })

  it('reports a missing Spark URI after the grouped write', async () => {
    const client = makeClient([
      {uri: 'at://did:plc:viewer/cc.sparkable.feed.reaction/reaction-key'},
    ])

    await expect(
      createReactionWithSpark({agent, subject, reactionType: 'insight'}),
    ).rejects.toThrow('Spark record was created but its URI was not returned')
    expect(client.applyWrites).toHaveBeenCalledTimes(1)
  })

  it('deletes the reaction and its Spark in one commit', async () => {
    const client = makeClient()

    await deleteReactionWithSpark({agent, subjectUri: subject.uri, likeUri})

    expect(client.applyWrites).toHaveBeenCalledTimes(1)
    expect(client.del).toHaveBeenNthCalledWith(1, reactionRecord, {
      rkey: 'reaction-key',
    })
    expect(client.del).toHaveBeenNthCalledWith(2, app.bsky.feed.like.main, {
      rkey: 'like1',
    })
  })

  it('rejects a non-Spark URI before sending any write', async () => {
    const client = makeClient()

    await expect(
      deleteReactionWithSpark({
        agent,
        subjectUri: subject.uri,
        likeUri: 'at://did:plc:viewer/app.bsky.feed.post/post1',
      }),
    ).rejects.toThrow('invalid Spark URI')
    expect(client.applyWrites).not.toHaveBeenCalled()
  })
})
