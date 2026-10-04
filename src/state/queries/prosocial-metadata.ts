import {
  type PostMetadata,
  postMetadataResponseSchema,
} from '@sparkable/prosocial-contract'
import {useQuery} from '@tanstack/react-query'

import {PROSOCIAL_METADATA_API_HOST} from '#/env'

const RQKEY_ROOT = 'prosocial-post-metadata'
export const prosocialMetadataQueryKey = (uri: string) => [RQKEY_ROOT, uri]

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
