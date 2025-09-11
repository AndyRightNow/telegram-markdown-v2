import type { Delete, Emphasis, Heading, Parents, Strong } from 'mdast';
import type { Info, State } from 'mdast-util-to-markdown';

import { wrap } from '../utils.js';
import { renderChildren } from './utils.js';

export function handleHeading(
  node: Heading,
  _parent: Parents | undefined,
  state: State,
  info: Info
): string {
  // Headers become bold text in Telegram
  const marker = '*';
  const exit = state.enter('headingAtx');
  const value = renderChildren(node, state, {
    ...info,
    before: marker,
    after: marker,
  });
  exit();
  return wrap(value, marker);
}

export function handleStrong(
  node: Strong,
  _parent: Parents | undefined,
  state: State,
  info: Info
): string {
  const marker = '*';
  const exit = state.enter('strong');
  const value = renderChildren(node, state, {
    ...info,
    before: marker,
    after: marker,
  });
  exit();
  return wrap(value, marker);
}

export function handleDelete(
  node: Delete,
  _parent: Parents | undefined,
  state: State,
  info: Info
): string {
  // Strikethrough in Telegram Markdown V2
  const marker = '~';
  const exit = state.enter('strong'); // Use 'strong' as fallback
  const value = renderChildren(node, state, {
    ...info,
    before: marker,
    after: marker,
  });
  exit();
  return wrap(value, marker);
}

export function handleEmphasis(
  node: Emphasis,
  _parent: Parents | undefined,
  state: State,
  info: Info
): string {
  // Italic in Telegram Markdown V2
  const marker = '_';
  const exit = state.enter('emphasis');
  const value = renderChildren(node, state, {
    ...info,
    before: marker,
    after: marker,
  });
  exit();
  return wrap(value, marker);
}