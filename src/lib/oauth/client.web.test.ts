jest.mock('#/env', () => ({
  getOAuthClientId: () => 'https://sparkable.test/client-metadata.json',
  OAUTH_SCOPE: 'atproto',
}))

jest.mock('#/logger', () => ({
  logger: {debug: jest.fn()},
}))

describe('isNavigatedBackError', () => {
  let isNavigatedBackError: typeof import('./client.web').isNavigatedBackError

  beforeAll(() => {
    // The module reads callback params from the URL when it loads
    Object.defineProperty(window, 'location', {
      value: {search: ''},
      configurable: true,
    })
    const mod = require('./client.web') as typeof import('./client.web')
    isNavigatedBackError = mod.isNavigatedBackError
  })

  it('matches the error from coming back to the page', () => {
    expect(isNavigatedBackError(new Error('User navigated back'))).toBe(true)
  })

  it('matches it when bundled with a cleanup error', () => {
    const err = new AggregateError([
      new Error('User navigated back'),
      new Error('Failed to abort request'),
    ])
    expect(isNavigatedBackError(err)).toBe(true)
  })

  it('does not match real failures', () => {
    expect(isNavigatedBackError(new Error('Failed to fetch'))).toBe(false)
    expect(isNavigatedBackError('User navigated back')).toBe(false)
    expect(isNavigatedBackError(undefined)).toBe(false)
  })
})
