import type { Definition as MdastDefinition } from 'mdast';
import type { Node } from 'unist';
import { remove } from 'unist-util-remove';
import { visit } from 'unist-util-visit';
import type { DefinitionsRecord } from './types.js';

/**
 * Fills the provided record with `Definition`s contained in the mdast.
 * They are keyed by identifier for subsequent `Reference` lookups.
 */
export function collectDefinitions(definitions: DefinitionsRecord) {
  return function (tree: Node) {
    visit(tree, 'definition', (node: MdastDefinition) => {
      definitions[node.identifier] = {
        title: node.title || null,
        url: node.url,
      };
    });
  };
}

/**
 * Removes `Definition`s and their parent `Paragraph`s from the mdast.
 * This avoids unwanted negative space in stringified output.
 */
export function removeDefinitions() {
  return function (tree: Node) {
    remove(tree, { cascade: true }, 'definition');
  };
}
