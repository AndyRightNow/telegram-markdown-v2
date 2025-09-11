import type { Handlers, Options } from 'mdast-util-to-markdown';

import type { DefinitionsRecord, UnsupportedTagsStrategy } from '../types.js';
import { handleBlockquote, handleHtml, handleList, handleListItem, handleTable } from './blocks.js';
import { handleDelete, handleEmphasis, handleHeading, handleStrong } from './formatting.js';
import { handleImage, handleImageReference, handleLink, handleLinkReference } from './links.js';
import { handleCode, handleInlineCode, handleText } from './text.js';

/**
 * Creates custom `mdast-util-to-markdown` handlers that tailor the output for
 * Telegram Markdown V2.
 */
function createHandlers(
  definitions: DefinitionsRecord,
  unsupportedTagsStrategy: UnsupportedTagsStrategy
): Partial<Handlers> {
  return {
    heading: handleHeading,
    strong: handleStrong,
    delete: handleDelete,
    emphasis: handleEmphasis,
    list: handleList,
    listItem: handleListItem,
    inlineCode: handleInlineCode,
    code: handleCode,
    link: handleLink,
    linkReference: handleLinkReference(definitions),
    image: handleImage,
    imageReference: handleImageReference(definitions),
    text: handleText,
    blockquote: handleBlockquote(unsupportedTagsStrategy),
    html: handleHtml(unsupportedTagsStrategy),
    table: handleTable(unsupportedTagsStrategy),
  };
}

/**
 * Creates options to be passed into a `remark-stringify` processor that tailor
 * the output for Telegram Markdown V2.
 */
export function createMarkdownOptions(
  definitions: DefinitionsRecord,
  unsupportedTagsStrategy: UnsupportedTagsStrategy = 'keep'
): Options {
  return {
    bullet: '*',
    bulletOrdered: '.',
    bulletOther: '+',
    tightDefinitions: true,
    listItemIndent: 'one',
    handlers: createHandlers(definitions, unsupportedTagsStrategy) as Handlers,
  };
}