import {type AtpAgent} from '@atproto/api'

import {CustomFeedAPI} from './custom'
import {MySkyFeedAPI} from './mysky'

jest.mock('#/state/preferences/languages', () => ({
  getAppLanguageAsContentLanguage: () => 'en',
  getContentLanguages: () => ['en'],
}))

const agent = {} as AtpAgent
const request = {cursor: undefined, limit: 30}
const mySkyPage = {feed: [], cursor: 'mysky-next'}
const discoverPage = {feed: [], cursor: 'discover-next'}

function makeApi() {
  const api = new MySkyFeedAPI({agent})
  const mySkyFetch = jest.fn().mockResolvedValue(mySkyPage)
  const discoverFetch = jest.fn().mockResolvedValue(discoverPage)
  api.mySky.fetch = mySkyFetch
  api.discover.fetch = discoverFetch
  return {api, mySkyFetch, discoverFetch}
}

describe('MySky feed fallback', () => {
  it('keeps MySky when its first page succeeds, even if empty', async () => {
    const {api, mySkyFetch, discoverFetch} = makeApi()
    expect(await api.fetch(request)).toBe(mySkyPage)
    expect(api.usingDiscover).toBe(false)
    expect(mySkyFetch).toHaveBeenCalledTimes(1)
    expect(discoverFetch).not.toHaveBeenCalled()
  })

  it('uses Discover and its cursor after MySky fails on page one', async () => {
    const {api, mySkyFetch, discoverFetch} = makeApi()
    mySkyFetch.mockRejectedValueOnce(new Error('feed generator unavailable'))

    expect(await api.fetch(request)).toBe(discoverPage)
    expect(api.usingDiscover).toBe(true)
    await api.fetch({cursor: 'discover-next', limit: 30})
    expect(mySkyFetch).toHaveBeenCalledTimes(1)
    expect(discoverFetch).toHaveBeenLastCalledWith({
      cursor: 'discover-next',
      limit: 30,
    })
  })

  it('does not mix Discover into a MySky feed after pagination fails', async () => {
    const {api, mySkyFetch, discoverFetch} = makeApi()
    await api.fetch(request)
    mySkyFetch.mockRejectedValueOnce(new Error('page two unavailable'))

    await expect(api.fetch({cursor: 'mysky-next', limit: 30})).rejects.toThrow(
      'page two unavailable',
    )
    expect(api.usingDiscover).toBe(false)
    expect(discoverFetch).not.toHaveBeenCalled()
  })

  it('retries MySky on a fresh first-page fetch', async () => {
    const {api, mySkyFetch} = makeApi()
    mySkyFetch.mockRejectedValueOnce(new Error('temporarily unavailable'))
    await api.fetch(request)

    expect(await api.fetch(request)).toBe(mySkyPage)
    expect(api.usingDiscover).toBe(false)
  })
})

describe('logged-out MySky requests', () => {
  it('surfaces HTTP failures so the fallback can run', async () => {
    const originalFetch = global.fetch
    global.fetch = jest.fn().mockResolvedValue({ok: false, status: 502})
    try {
      const api = new CustomFeedAPI({
        agent,
        feedParams: {feed: 'at://did:plc:example/app.bsky.feed.generator/test'},
        failOnHttpError: true,
      })
      await expect(api.fetch(request)).rejects.toThrow(
        'Feed request failed (502)',
      )
      expect(global.fetch).toHaveBeenCalledTimes(2)
    } finally {
      global.fetch = originalFetch
    }
  })
})
