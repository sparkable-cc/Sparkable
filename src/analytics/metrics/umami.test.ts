import {registerSparkableAccount, trackUmamiEvent} from './umami'

jest.mock('#/env', () => ({
  IS_WEB: true,
  SPARKABLE_ANALYTICS_HOST: 'https://analytics.sparkable.test',
}))

describe('Umami metrics bridge', () => {
  const track = jest.fn()
  const fetchMock = jest.fn()

  beforeEach(() => {
    track.mockReset()
    fetchMock.mockReset()
    global.fetch = fetchMock
    ;(globalThis as typeof globalThis & {umami?: {track: jest.Mock}}).umami = {
      track,
    }
  })

  afterAll(() => {
    delete (globalThis as typeof globalThis & {umami?: unknown}).umami
  })

  it('forwards an allowlisted event with only safe properties', () => {
    trackUmamiEvent('spark:reaction:selected', {
      reaction: 'hope',
      surface: 'feed',
      postUri: 'at://did:plc:sensitive/post/1',
      authorDid: 'did:plc:sensitive',
    })

    expect(track).toHaveBeenCalledWith('spark:reaction:selected', {
      reaction: 'hope',
      surface: 'feed',
    })
  })

  it('ignores events that are not explicitly allowlisted', () => {
    trackUmamiEvent('search:query', {query: 'private search'})

    expect(track).not.toHaveBeenCalled()
  })

  it('drops identifier-like values even on an allowed property', () => {
    trackUmamiEvent('chat:open', {logContext: 'did:plc:sensitive'})

    expect(track).toHaveBeenCalledWith('chat:open', undefined)
  })

  it('does not throw when the tracker fails', () => {
    track.mockImplementation(() => {
      throw new Error('tracker unavailable')
    })

    expect(() => trackUmamiEvent('post:like', {})).not.toThrow()
  })

  it('tracks a join only when the service confirms the account is new', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({isNew: true}),
    })

    await registerSparkableAccount('did:plc:test-account', 'oauth')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://analytics.sparkable.test/join',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({did: 'did:plc:test-account'}),
      }),
    )
    expect(track).toHaveBeenCalledWith('account:joinedSparkable', {
      source: 'oauth',
    })
  })

  it('does not track returning accounts as new joins', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({isNew: false}),
    })

    await registerSparkableAccount('did:plc:returning-account', 'resume')

    expect(track).not.toHaveBeenCalled()
  })
})
