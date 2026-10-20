import {describe, expect, it, jest} from '@jest/globals'
// eslint-disable-next-line import/no-nodejs-modules -- the hook check reads source files
import {readFileSync} from 'fs'

import {PROD_FEEDS, SPARKABLE_FEED_URI} from '#/lib/constants'
import {type StateContext} from '#/state/feed-feedback'
import {
  armMutedWordSignal,
  disarmMutedWordSignal,
  FEED_SIGNALS,
  onMutedWordSaved,
  sparkableFeedProxy,
} from '../signals'

const SERVICE_DID = 'did:web:feed.sparkable.cc'

function feedback(
  uri: string,
  {enabled = true, type = 'feed'}: {enabled?: boolean; type?: string} = {},
) {
  return {
    enabled,
    feedSourceInfo: {type, uri, view: {did: SERVICE_DID}},
  } as unknown as Pick<StateContext, 'enabled' | 'feedSourceInfo'>
}

describe('sparkableFeedProxy', () => {
  it('sends to the Sparkable feed', () => {
    expect(sparkableFeedProxy(feedback(SPARKABLE_FEED_URI))).toBe(SERVICE_DID)
  })

  it('never sends to any other feed, Discover included', () => {
    const discover = PROD_FEEDS[0].slice('feedgen|'.length)
    const other =
      'at://did:plc:aaaaaaaaaaaaaaaaaaaaaaaa/app.bsky.feed.generator/other'
    expect(sparkableFeedProxy(feedback(discover))).toBeNull()
    expect(sparkableFeedProxy(feedback(other))).toBeNull()
    expect(
      sparkableFeedProxy(feedback(SPARKABLE_FEED_URI, {type: 'list'})),
    ).toBeNull()
  })

  it('sends nothing when feed feedback is off', () => {
    expect(
      sparkableFeedProxy(feedback(SPARKABLE_FEED_URI, {enabled: false})),
    ).toBeNull()
    expect(
      sparkableFeedProxy({enabled: true, feedSourceInfo: undefined}),
    ).toBeNull()
  })
})

describe('muted word signal', () => {
  it('fires once, only after a word is saved', () => {
    const send = jest.fn()
    armMutedWordSignal(send)
    expect(send).not.toHaveBeenCalled()
    onMutedWordSaved()
    onMutedWordSaved()
    expect(send).toHaveBeenCalledTimes(1)
  })

  it('does not fire if the dialog closes without saving', () => {
    const send = jest.fn()
    armMutedWordSignal(send)
    disarmMutedWordSignal()
    onMutedWordSaved()
    expect(send).not.toHaveBeenCalled()
  })
})

/*
 * The signals are sent from hooks in two of Bluesky's files. A merge of
 * Bluesky's updates could drop one without any type error, so check that
 * every hook is still there.
 */
describe('hooks in Bluesky files', () => {
  const read = (path: string) =>
    readFileSync(`${__dirname}/../../../${path}`, 'utf8')

  it('the post menu sends every signal', () => {
    const postMenu = read('components/PostControls/PostMenu/PostMenuItems.tsx')
    for (const name of Object.keys(FEED_SIGNALS)) {
      expect(postMenu).toContain(`FEED_SIGNALS.${name}`)
    }
  })

  it('the muted words dialog reports saves and closes', () => {
    const dialog = read('components/dialogs/MutedWords.tsx')
    expect(dialog).toContain('onMutedWordSaved()')
    expect(dialog).toContain('onClose={disarmMutedWordSignal}')
  })
})
