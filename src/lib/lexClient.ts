import {
  type Agent,
  type AgentOptions,
  Client,
  type ClientOptions,
} from '@atproto/lex'

/**
 * Creates the schema-first Lex client used for custom AT Protocol records.
 * Response processing is relaxed to match the existing Bluesky agent.
 */
export function createLexClient(
  agent: Agent | AgentOptions,
  options: ClientOptions = {},
) {
  return new Client(agent, {
    strictResponseProcessing: false,
    ...options,
  })
}
