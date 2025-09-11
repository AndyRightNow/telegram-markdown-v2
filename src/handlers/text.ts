import type { Code, InlineCode, Parents, Text } from 'mdast';
import type { Info, State } from 'mdast-util-to-markdown';

import { escapeSymbols, wrap } from '../utils.js';

export function handleText(
  node: Text,
  _parent: Parents | undefined,
  state: State,
  _info: Info
): string {
  const exit = state.enter('phrasing');
  const text = node.value;
  exit();
  return escapeSymbols(text);
}

export function handleInlineCode(
  node: InlineCode,
  _parent: Parents | undefined,
  state: State,
  _info: Info
): string {
  const exit = state.enter('paragraph');
  const value = escapeSymbols(node.value, 'code');
  exit();
  return `\`${value}\``;
}

export function handleCode(
  node: Code,
  _parent: Parents | undefined,
  state: State,
  _info: Info
): string {
  const exit = state.enter('codeFenced');

  // Remove language prefix for deprecated markdown formatters
  const content = node.value.replace(/^#![a-z]+\n/, '');
  const escapedContent = escapeSymbols(content, 'code');
  exit();

  // For compatibility with original tests, don't include language
  // (can be enabled later for full V2 support)
  return wrap(escapedContent, '```', '\n');
}