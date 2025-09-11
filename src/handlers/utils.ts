import type { Parents } from 'mdast';
import type { Info, State } from 'mdast-util-to-markdown';

/**
 * Helper function to render child nodes recursively
 */
export function renderChildren(node: Parents, state: State, info: Info): string {
  if (!node.children) return '';

  let result = '';
  for (const child of node.children) {
    result += state.handle(child, node, state, info);
  }
  return result;
}