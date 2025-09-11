import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRemoveComments from 'remark-remove-comments';
import remarkStringify from 'remark-stringify';

import { collectDefinitions, removeDefinitions } from './definitions.js';
import { createMarkdownOptions } from './handlers/index.js';
import type { DefinitionsRecord, UnsupportedTagsStrategy } from './types.js';

/**
 * Pre-processes the markdown to handle Telegram V2 specific HTML tags
 */
function preprocessV2HtmlTags(text: string): string {
  let processed = text;

  // Convert <u>content</u> to a temporary placeholder that won't conflict with markdown
  processed = processed.replace(/<u>(.*?)<\/u>/g, (match, content) => {
    return `【U:${content}:U】`;
  });

  // Convert <span class="tg-spoiler">content</span> to a temporary placeholder
  processed = processed.replace(
    /<span class="tg-spoiler">(.*?)<\/span>/g,
    (match, content) => {
      return `【S:${content}:S】`;
    }
  );

  return processed;
}

/**
 * Post-processes the converted markdown to restore Telegram V2 specific formatting
 */
function postprocessV2Formatting(text: string): string {
  let processed = text;

  // Convert placeholders back to Telegram V2 format
  processed = processed.replace(/【U:(.*?):U】/g, (match, content) => {
    return `__${content}__`;
  });

  processed = processed.replace(/【S:(.*?):S】/g, (match, content) => {
    return `||${content}||`;
  });

  return processed;
}

/**
 * Converts markdown to Telegram Markdown V2 format.
 *
 * @param markdown The markdown string to convert
 * @param unsupportedTagsStrategy Strategy for handling unsupported tags ('escape' | 'remove' | 'keep')
 * @returns The converted Telegram Markdown V2 string
 */
export function convert(
  markdown: string,
  unsupportedTagsStrategy: UnsupportedTagsStrategy = 'keep'
): string {
  const definitions: DefinitionsRecord = {};
  const markdownOptions = createMarkdownOptions(
    definitions,
    unsupportedTagsStrategy
  );

  // Pre-process V2 HTML tags BEFORE markdown processing
  const processedMarkdown = preprocessV2HtmlTags(markdown);

  let result = remark()
    .use(remarkGfm)
    .use(remarkRemoveComments)
    .use(collectDefinitions, definitions)
    .use(removeDefinitions)
    .use(remarkStringify, markdownOptions)
    .processSync(processedMarkdown)
    .toString()
    .replace(/<!---->\n/gi, ''); // Remove empty HTML comments

  // Post-process to restore V2 formatting
  result = postprocessV2Formatting(result);

  return result;
}
