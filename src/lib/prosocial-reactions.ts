import {type AtpAgent, AtUri} from '@atproto/api'
import {type Agent, type AtUriString, l} from '@atproto/lex'
import {app} from '@bsky/sdk/lexicons'
import {
  main as reactionRecord,
  type ReactionType,
  rkeyForSubjectUri,
} from '@sparkable/prosocial-contract'

import {createLexClient} from '#/lib/lexClient'

type StrongRef = {uri: string; cid: string}

function clientFor(agent: AtpAgent) {
  const lexAgent: Agent = {
    did: agent.did,
    fetchHandler: (path, init) => agent.fetchHandler(path, init),
  }
  return createLexClient(lexAgent)
}

function reactionValue(subject: StrongRef, reactionType: ReactionType) {
  return {
    subject: {
      uri: subject.uri as AtUriString,
      cid: subject.cid,
    },
    reactionType,
    createdAt: l.currentDatetimeString(),
  }
}

function likeValue(subject: StrongRef, via?: StrongRef) {
  return {
    subject: {
      uri: subject.uri as AtUriString,
      cid: subject.cid,
    },
    createdAt: l.currentDatetimeString(),
    ...(via
      ? {
          via: {
            uri: via.uri as AtUriString,
            cid: via.cid,
          },
        }
      : {}),
  }
}

/** Creates the reaction and its required Spark in one repository commit. */
export async function createReactionWithSpark({
  agent,
  subject,
  reactionType,
  via,
}: {
  agent: AtpAgent
  subject: StrongRef
  reactionType: ReactionType
  via?: StrongRef
}) {
  const client = clientFor(agent)
  const response = await client.applyWrites(op => [
    op.create(reactionRecord, reactionValue(subject, reactionType), {
      rkey: rkeyForSubjectUri(subject.uri),
    }),
    op.create(app.bsky.feed.like.main, likeValue(subject, via)),
  ])
  const likeResult = response.body.results?.find(
    result =>
      'uri' in result &&
      new AtUri(result.uri).collection === 'app.bsky.feed.like',
  )
  if (!likeResult || !('uri' in likeResult)) {
    throw new Error('Spark record was created but its URI was not returned')
  }
  return {likeUri: likeResult.uri}
}

/** Upserts the deterministic reaction record while preserving the Spark. */
export async function putReaction({
  agent,
  subject,
  reactionType,
}: {
  agent: AtpAgent
  subject: StrongRef
  reactionType: ReactionType
}) {
  return clientFor(agent).put(
    reactionRecord,
    reactionValue(subject, reactionType),
    {rkey: rkeyForSubjectUri(subject.uri)},
  )
}

/** Deletes the reaction and its associated Spark in one repository commit. */
export async function deleteReactionWithSpark({
  agent,
  subjectUri,
  likeUri,
}: {
  agent: AtpAgent
  subjectUri: string
  likeUri: string
}) {
  const like = new AtUri(likeUri)
  if (like.collection !== 'app.bsky.feed.like' || !like.rkey) {
    throw new Error('Cannot remove reaction: invalid Spark URI')
  }

  return clientFor(agent).applyWrites(op => [
    op.delete(reactionRecord, {rkey: rkeyForSubjectUri(subjectUri)}),
    op.delete(app.bsky.feed.like.main, {rkey: like.rkey}),
  ])
}
