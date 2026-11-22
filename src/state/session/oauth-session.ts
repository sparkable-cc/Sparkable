import {type Agent, type Client} from '@atproto/lex'
import {type OAuthSession} from '@atproto/oauth-client-browser'

import {BSKY_SERVICE} from '#/lib/constants'
import {restoreOAuthSession} from '#/lib/oauth/client'
import {prefetchAgeAssuranceServerData} from '#/ageAssurance/data'
import {features} from '#/analytics'
import {com} from '#/lexicons'
import {buildAppviewClient, buildChatClient, buildPdsClient} from './clients'
import {configureModerationForAccount} from './moderation'
import {type SessionAccount} from './types'

export type OAuthSessionBundle = {
  readonly authMethod: 'oauth'
  readonly session: OAuthSession
  readonly appviewClient: Client
  readonly pdsClient: Client
  readonly chatClient: Client
  readonly service: URL
  dispose(): void
}

export function isOAuthBundle(bundle: unknown): bundle is OAuthSessionBundle {
  return (
    typeof bundle === 'object' &&
    bundle !== null &&
    'authMethod' in bundle &&
    bundle.authMethod === 'oauth'
  )
}

async function createOAuthBundle(session: OAuthSession) {
  let disposed = false
  const agent: Agent = {
    get did() {
      return session.did
    },
    fetchHandler(path, init) {
      if (disposed) {
        throw new Error('session disposed')
      }
      return session.fetchHandler(path, init)
    },
  }
  const bundle: OAuthSessionBundle = {
    authMethod: 'oauth',
    session,
    appviewClient: buildAppviewClient(agent),
    pdsClient: buildPdsClient(agent),
    chatClient: buildChatClient(agent),
    service: new URL(session.serverMetadata.issuer),
    dispose() {
      disposed = true
    },
  }

  try {
    // The PDS handshake verifies the granted scopes before activating the account.
    const data = await bundle.pdsClient.call(com.atproto.server.getSession, {})
    const account: SessionAccount = {
      service: bundle.service.toString(),
      did: data.did,
      handle: data.handle,
      email: data.email,
      emailConfirmed: data.emailConfirmed || false,
      emailAuthFactor: data.emailAuthFactor || false,
      signupQueued: false,
      active: data.active ?? true,
      status: data.status,
      isSelfHosted: !bundle.service.toString().startsWith(BSKY_SERVICE),
      authMethod: 'oauth',
    }
    configureModerationForAccount(bundle, account)
    await Promise.all([
      features.refresh({strategy: 'prefer-fresh-gates'}),
      prefetchAgeAssuranceServerData({
        appviewClient: bundle.appviewClient,
        accountClient: bundle.pdsClient,
      }),
    ])
    return {bundle, account}
  } catch (error) {
    bundle.dispose()
    throw error
  }
}

export function createOAuthBundleAndLogin(session: OAuthSession) {
  return createOAuthBundle(session)
}

export async function createOAuthBundleAndResume(account: SessionAccount) {
  const session = await restoreOAuthSession(account.did)
  if (!session) throw new Error('OAuth session is no longer available')
  return createOAuthBundle(session)
}
