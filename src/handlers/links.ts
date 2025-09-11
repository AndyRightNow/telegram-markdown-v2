import type { Image, ImageReference, Link, LinkReference, Parents } from 'mdast';
import type { Info, State } from 'mdast-util-to-markdown';

import type { DefinitionsRecord } from '../types.js';
import { escapeSymbols, isURL } from '../utils.js';
import { renderChildren } from './utils.js';

export function handleLink(
  node: Link,
  _parent: Parents | undefined,
  state: State,
  _info: Info
): string {
  const exit = state.enter('link');
  const text =
    renderChildren(node, state, { ..._info, before: '[', after: ']' }) ||
    (node.title ? escapeSymbols(node.title) : '');
  const isUrlEncoded = decodeURI(node.url) !== node.url;
  const url = isUrlEncoded ? node.url : encodeURI(node.url);
  exit();

  if (!isURL(url)) return text || escapeSymbols(url);

  return text
    ? `[${text}](${escapeSymbols(url, 'link')})`
    : `[${escapeSymbols(url)}](${escapeSymbols(url, 'link')})`;
}

export function handleLinkReference(
  definitions: DefinitionsRecord
) {
  return function (
    node: LinkReference,
    _parent: Parents | undefined,
    state: State,
    _info: Info
  ): string {
    const exit = state.enter('linkReference');
    const definition = definitions[node.identifier];
    const text =
      renderChildren(node, state, { ..._info, before: '[', after: ']' }) ||
      (definition ? definition.title : null);
    exit();

    if (!definition || !isURL(definition.url)) return escapeSymbols(text);

    return text
      ? `[${text}](${escapeSymbols(definition.url, 'link')})`
      : `[${escapeSymbols(definition.url)}](${escapeSymbols(definition.url, 'link')})`;
  };
}

export function handleImage(
  node: Image,
  _parent: Parents | undefined,
  state: State,
  _info: Info
): string {
  const exit = state.enter('image');
  const text = node.alt || node.title;
  const url = node.url;
  exit();

  if (!isURL(url)) return escapeSymbols(text) || escapeSymbols(url);

  return text
    ? `[${escapeSymbols(text)}](${escapeSymbols(url, 'link')})`
    : `[${escapeSymbols(url)}](${escapeSymbols(url, 'link')})`;
}

export function handleImageReference(
  definitions: DefinitionsRecord
) {
  return function (
    node: ImageReference,
    _parent: Parents | undefined,
    state: State,
    _info: Info
  ): string {
    const exit = state.enter('imageReference');
    const definition = definitions[node.identifier];
    const text = node.alt || (definition ? definition.title : null);
    exit();

    if (!definition || !isURL(definition.url)) return escapeSymbols(text);

    return text
      ? `[${escapeSymbols(text)}](${escapeSymbols(definition.url, 'link')})`
      : `[${escapeSymbols(definition.url)}](${escapeSymbols(definition.url, 'link')})`;
  };
}