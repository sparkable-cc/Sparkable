import {parsePlatform} from './platform'
import {
  DISMISS_COOLDOWN_MS,
  getIosSteps,
  getPromptMethod,
  isPromptDue,
} from './rules'

const UA = {
  // iOS 26 Safari reports a frozen "OS 18_6" but a real Safari version
  iphoneSafari26:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
  iphoneSafari18:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',
  ipadDesktopMode:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15',
  iphoneChrome:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.41 Mobile/15E148 Safari/604.1',
  iphoneLinkedIn:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]/9.31.1234',
  iphoneInstagram:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 400.0.0.0.0 (iPhone16,2; iOS 18_6; en_US)',
  androidChrome:
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
  androidSamsung:
    'Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36',
  androidFirefox:
    'Mozilla/5.0 (Android 14; Mobile; rv:144.0) Gecko/144.0 Firefox/144.0',
  androidFacebook:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/141.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/500.0.0.0;]',
  desktopChrome:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
}

describe('parsePlatform', () => {
  it('reads Safari 26 on iPhone despite the frozen OS version', () => {
    expect(parsePlatform(UA.iphoneSafari26, 5)).toEqual({
      os: 'ios',
      browser: 'safari',
      safariVersion: 26,
      inAppBrowser: false,
    })
  })

  it('recognizes an iPad that identifies as a Mac', () => {
    expect(parsePlatform(UA.ipadDesktopMode, 5).os).toBe('ios')
    expect(parsePlatform(UA.ipadDesktopMode, 0).os).toBe('other')
  })

  it('tells browsers apart', () => {
    expect(parsePlatform(UA.iphoneChrome, 5).browser).toBe('chrome')
    expect(parsePlatform(UA.androidChrome, 5).browser).toBe('chrome')
    expect(parsePlatform(UA.androidSamsung, 5).browser).toBe('samsung')
    expect(parsePlatform(UA.androidFirefox, 5).browser).toBe('firefox')
  })

  it('flags browsers built into other apps', () => {
    expect(parsePlatform(UA.iphoneLinkedIn, 5).inAppBrowser).toBe(true)
    expect(parsePlatform(UA.iphoneInstagram, 5).inAppBrowser).toBe(true)
    expect(parsePlatform(UA.androidFacebook, 5).inAppBrowser).toBe(true)
    expect(parsePlatform(UA.iphoneSafari26, 5).inAppBrowser).toBe(false)
    expect(parsePlatform(UA.androidChrome, 5).inAppBrowser).toBe(false)
  })

  it('treats computers as other', () => {
    expect(parsePlatform(UA.desktopChrome, 0).os).toBe('other')
  })
})

describe('getPromptMethod', () => {
  const method = (
    ua: string,
    canInstall = false,
    standalone = false,
    maxTouchPoints = 5,
  ) =>
    getPromptMethod({
      platform: parsePlatform(ua, maxTouchPoints),
      standalone,
      canInstall,
    })

  it('uses the install window on Android when the browser offers it', () => {
    expect(method(UA.androidChrome, true)).toBe('install')
    expect(method(UA.androidSamsung, true)).toBe('install')
  })

  it('stays quiet on Chromium when no install window is offered', () => {
    expect(method(UA.androidChrome, false)).toBeUndefined()
  })

  it('shows menu steps on Firefox for Android', () => {
    expect(method(UA.androidFirefox)).toBe('android-steps')
  })

  it('shows Share steps in every iOS browser', () => {
    expect(method(UA.iphoneSafari26)).toBe('ios-steps')
    expect(method(UA.iphoneChrome)).toBe('ios-steps')
  })

  it('never shows in app browsers, on computers or from the home screen', () => {
    expect(method(UA.iphoneLinkedIn)).toBeUndefined()
    expect(method(UA.androidFacebook, true)).toBeUndefined()
    expect(method(UA.desktopChrome, false, false, 0)).toBeUndefined()
    expect(method(UA.iphoneSafari26, false, true)).toBeUndefined()
  })
})

describe('getIosSteps', () => {
  it('describes the ••• menu and web app switch only for Safari 26+', () => {
    expect(getIosSteps(parsePlatform(UA.iphoneSafari26, 5))).toEqual({
      shareInMoreMenu: true,
      openAsWebAppSwitch: true,
    })
    expect(getIosSteps(parsePlatform(UA.iphoneSafari18, 5))).toEqual({
      shareInMoreMenu: false,
      openAsWebAppSwitch: false,
    })
    expect(getIosSteps(parsePlatform(UA.iphoneChrome, 5)).shareInMoreMenu).toBe(
      false,
    )
  })
})

describe('isPromptDue', () => {
  const now = Date.UTC(2026, 9, 30)
  const due = (record: Parameters<typeof isPromptDue>[0]['record']) =>
    isPromptDue({record, signedIn: true, now})

  it('waits for the second visit and a signed-in account', () => {
    expect(due({visits: 1, dismissCount: 0})).toBe(false)
    expect(due({visits: 2, dismissCount: 0})).toBe(true)
    expect(
      isPromptDue({record: {visits: 2, dismissCount: 0}, signedIn: false, now}),
    ).toBe(false)
  })

  it('waits 30 days after "Not now"', () => {
    const record = {visits: 5, dismissCount: 1}
    expect(
      due({...record, lastDismissedAt: now - DISMISS_COOLDOWN_MS + 1}),
    ).toBe(false)
    expect(due({...record, lastDismissedAt: now - DISMISS_COOLDOWN_MS})).toBe(
      true,
    )
  })

  it('stops after the second "Not now" or once done', () => {
    expect(due({visits: 9, dismissCount: 2, lastDismissedAt: 0})).toBe(false)
    expect(due({visits: 9, dismissCount: 0, done: true})).toBe(false)
  })
})
