/**
 * What we need to know about the browser to decide whether, and how, to
 * suggest adding Sparkable to the home screen. Parsed from the user agent
 * because the install capabilities differ by browser, not by feature flag.
 */
export type HomeScreenPlatform = {
  os: 'ios' | 'android' | 'other'
  browser:
    | 'safari'
    | 'chrome'
    | 'firefox'
    | 'samsung'
    | 'edge'
    | 'opera'
    | 'other'
  /**
   * Safari's major version on iPhone and iPad, from its `Version/` token. iOS
   * 26 froze the OS version in the user agent at 18, so this is the reliable
   * way to tell which Safari menus the steps should describe.
   */
  safariVersion?: number
  /**
   * Browsers built into other apps (LinkedIn, Instagram, Facebook, TikTok, X
   * and so on) can't add anything to the home screen.
   */
  inAppBrowser: boolean
}

/*
 * Tokens that apps add to their built-in browser's user agent. "; wv)" marks
 * any Android WebView, and GSA is the Google app on iOS.
 */
const IN_APP_BROWSER =
  /FBAN|FBAV|FB_IAB|FBIOS|Instagram|LinkedInApp|BytedanceWebview|musical_ly|TikTok|Twitter|Snapchat|Pinterest|Line\/|MicroMessenger|GSA\/|; wv\)/i

/**
 * @param maxTouchPoints `navigator.maxTouchPoints`, needed because iPads
 * identify as a Mac by default.
 */
export function parsePlatform(
  userAgent: string,
  maxTouchPoints: number,
): HomeScreenPlatform {
  const ipad =
    /iPad/.test(userAgent) ||
    (/Macintosh/.test(userAgent) && maxTouchPoints > 1)
  const ios = ipad || /iPhone|iPod/.test(userAgent)
  const android = !ios && /Android/.test(userAgent)

  let browser: HomeScreenPlatform['browser'] = 'other'
  if (ios) {
    if (/CriOS\//.test(userAgent)) browser = 'chrome'
    else if (/FxiOS\//.test(userAgent)) browser = 'firefox'
    else if (/EdgiOS\//.test(userAgent)) browser = 'edge'
    else if (/OPiOS\/|OPT\//.test(userAgent)) browser = 'opera'
    else if (/Version\/\d+.*Safari\//.test(userAgent)) browser = 'safari'
  } else if (android) {
    if (/SamsungBrowser\//.test(userAgent)) browser = 'samsung'
    else if (/EdgA\//.test(userAgent)) browser = 'edge'
    else if (/OPR\//.test(userAgent)) browser = 'opera'
    else if (/Firefox\//.test(userAgent)) browser = 'firefox'
    else if (/Chrome\//.test(userAgent)) browser = 'chrome'
  }

  const version = userAgent.match(/Version\/(\d+)/)

  return {
    os: ios ? 'ios' : android ? 'android' : 'other',
    browser,
    safariVersion:
      browser === 'safari' && version ? Number(version[1]) : undefined,
    inAppBrowser: IN_APP_BROWSER.test(userAgent),
  }
}
