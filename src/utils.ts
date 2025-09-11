import type { TextType, UnsupportedTagsStrategy } from './types.js';

export function wrap(string: string, ...wrappers: string[]): string {
  return [...wrappers, string, ...wrappers.reverse()].join('');
}

export function isURL(string: string): boolean {
  try {
    return Boolean(new URL(string));
  } catch {
    return false;
  }
}

/**
 * Escapes symbols according to Telegram Markdown V2 specification.
 * Any character with code between 1 and 126 inclusively can be escaped anywhere
 * with a preceding '\' character.
 */
export function escapeSymbols(
  text: string | null | undefined,
  textType: TextType = 'text'
): string {
  if (!text) {
    return text || '';
  }

  switch (textType) {
    case 'code':
      // Inside pre and code entities, all '`' and '\' characters must be escaped
      return text.replace(/\\/g, '\\\\').replace(/`/g, '\\`');

    case 'link': {
      // Inside the (...) part of inline link, all ')' and '\' must be escaped
      // For tg:// URLs, also escape '?' and '=' characters
      let result = text
        .replace(/\\/g, '\\\\')
        .replace(/\)/g, '\\)')
        .replace(/\(/g, '\\(');
      if (text.startsWith('tg://')) {
        result = result.replace(/\?/g, '\\?').replace(/=/g, '\\=');
      }
      return result;
    }

    default:
      // In all other places these characters must be escaped:
      // '_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'
      return text
        .replace(/\\/g, '\\\\')
        .replace(/_/g, '\\_')
        .replace(/\*/g, '\\*')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/~/g, '\\~')
        .replace(/`/g, '\\`')
        .replace(/>/g, '\\>')
        .replace(/#/g, '\\#')
        .replace(/\+/g, '\\+')
        .replace(/-/g, '\\-')
        .replace(/=/g, '\\=')
        .replace(/\|/g, '\\|')
        .replace(/{/g, '\\{')
        .replace(/}/g, '\\}')
        .replace(/\./g, '\\.')
        .replace(/!/g, '\\!');
  }
}

export function processUnsupportedTags(
  content: string,
  strategy: UnsupportedTagsStrategy
): string {
  switch (strategy) {
    case 'escape':
      return escapeSymbols(content);
    case 'remove':
      return '';
    case 'keep':
    default:
      return content;
  }
}
