import { CaseType, CaseField } from '@prisma/client';

export interface AiCompletionResponse {
  content: string;
  promptTokens?: number;
  completionTokens?: number;
  latencyMs?: number;
  modelName: string;
}

export interface AiClassificationResponse extends AiCompletionResponse {
  suggestedType: CaseType;
  suggestedField: CaseField;
  confidenceScore: number;
  legalRationale: string;
}

export interface AiChecklistResponse extends AiCompletionResponse {
  items: string[];
}

export interface AiDraftResponse extends AiCompletionResponse {
  draftTitle: string;
  draftContent: string;
  legalReferences: string[];
}

export const AI_PROVIDER_TOKEN = 'AI_PROVIDER_TOKEN';

export interface IAiProvider {
  /**
   * Generates text based on system prompt and user prompt
   */
  generateText(systemPrompt: string, userPrompt: string): Promise<AiCompletionResponse>;

  /**
   * Summarizes petition content
   */
  summarize(text: string): Promise<AiCompletionResponse>;

  /**
   * Classifies petition into CaseType and CaseField
   */
  classify(text: string): Promise<AiClassificationResponse>;

  /**
   * Suggests verification checklist items
   */
  suggestChecklist(text: string): Promise<AiChecklistResponse>;

  /**
   * Drafts official response or notification
   */
  draftResponse(petitionContext: Record<string, any>, draftType: string): Promise<AiDraftResponse>;
}
