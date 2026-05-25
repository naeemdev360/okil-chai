export const AI_PROVIDER = Symbol('AI_PROVIDER');

/** Pluggable AI completion backend — implement to support any LLM provider. */
export interface IAiProvider {
  /** Send a single user message and return the model's raw text reply. */
  complete(prompt: string): Promise<string>;
}
