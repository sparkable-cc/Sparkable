import {
  isReactionType,
  type PostMetadata,
  postMetadataResponseSchema,
  type ReactionType,
  rkeyForSubjectUri,
} from '@sparkable/prosocial-contract'
import {type QueryClient, useQuery} from '@tanstack/react-query'

import {useAgent} from '#/state/session'
import {PROSOCIAL_METADATA_API_HOST} from '#/env'

const RQKEY_ROOT = 'prosocial-post-metadata'
export const prosocialMetadataQueryKey = (uri: string) => [RQKEY_ROOT, uri]
export const viewerProsocialReactionQueryKey = (did: string, uri: string) => [
  'viewer-prosocial-reaction',
  did,
  uri,
]

const emptyCounts = () => ({
  insight: 0,
  compassion: 0,
  joy: 0,
  inspiration: 0,
  hope: 0,
  respect: 0,
})

/** Show a reaction change immediately, including when the count was not loaded yet. */
export function updateProsocialReactionCache(
  queryClient: QueryClient,
  uri: string,
  previous: ReactionType | null,
  next: ReactionType | null,
) {
  queryClient.setQueryData<PostMetadata>(
    prosocialMetadataQueryKey(uri),
    old => {
      const counts = {...(old?.reactionCounts ?? emptyCounts())}
      if (previous !== next) {
        if (previous) counts[previous] = Math.max(0, counts[previous] - 1)
        if (next) counts[next] += 1
      }
      return {
        uri,
        reactionCounts: counts,
        viewerReaction: next,
      }
    },
  )
}

type PendingRequest = {
  resolve: (metadata: PostMetadata) => void
  reject: (error: Error) => void
}

const pending = new Map<string, PendingRequest[]>()
let flushTimer: ReturnType<typeof setTimeout> | undefined

async function flush() {
  flushTimer = undefined
  const batch = new Map(pending)
  pending.clear()
  const uris = [...batch.keys()]

  try {
    const posts: PostMetadata[] = []
    for (let index = 0; index < uris.length; index += 100) {
      const response = await fetch(
        `${PROSOCIAL_METADATA_API_HOST}/v1/post-metadata`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({uris: uris.slice(index, index + 100)}),
        },
      )
      if (!response.ok) {
        throw new Error(`Post metadata request failed (${response.status})`)
      }
      posts.push(
        ...postMetadataResponseSchema.parse(await response.json()).posts,
      )
    }

    const byUri = new Map(posts.map(post => [post.uri, post]))
    for (const [uri, requests] of batch) {
      const metadata = byUri.get(uri)
      if (!metadata) {
        throw new Error(`Post metadata response omitted ${uri}`)
      }
      for (const request of requests) request.resolve(metadata)
    }
  } catch (error) {
    const failure =
      error instanceof Error ? error : new Error('Post metadata request failed')
    for (const requests of batch.values()) {
      for (const request of requests) request.reject(failure)
    }
  }
}

function fetchPostMetadata(uri: string): Promise<PostMetadata> {
  return new Promise((resolve, reject) => {
    const requests = pending.get(uri) ?? []
    requests.push({resolve, reject})
    pending.set(uri, requests)
    flushTimer ??= setTimeout(() => void flush(), 10)
  })
}

export function useProsocialPostMetadata(uri: string) {
  return useQuery({
    queryKey: prosocialMetadataQueryKey(uri),
    queryFn: () => fetchPostMetadata(uri),
    staleTime: 30_000,
    retry: 1,
  })
}

/** Read the viewer's own record from their PDS; the count service is anonymous. */
export function useViewerProsocialReaction(uri: string, liked: boolean) {
  const agent = useAgent()
  const did = agent.did
  return useQuery<ReactionType | null>({
    queryKey: viewerProsocialReactionQueryKey(did ?? '', uri),
    enabled: Boolean(did && liked),
    staleTime: 30_000,
    queryFn: async () => {
      if (!did) return null
      try {
        const {data} = await agent.api.com.atproto.repo.getRecord({
          repo: did,
          collection: 'cc.sparkable.feed.reaction',
          rkey: rkeyForSubjectUri(uri),
        })
        const value = data.value as {
          subject?: {uri?: unknown}
          reactionType?: unknown
        }
        return value.subject?.uri === uri && isReactionType(value.reactionType)
          ? value.reactionType
          : null
      } catch (error) {
        if ((error as {error?: string}).error === 'RecordNotFound') {
          return null
        }
        throw error
      }
    },
  })
}
