import {trackUmamiEvent} from './umami'

jest.mock('#/env', () => ({IS_WEB: true}))

describe('Umami metrics bridge', () => {
  const track = jest.fn()

  beforeEach(() => {
    track.mockReset()
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
})
