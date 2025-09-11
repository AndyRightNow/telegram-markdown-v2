# telegram-markdown-v2

A lightweight TypeScript library for seamlessly transforming standard Markdown into Telegram's MarkdownV2 format. Built for developers who want reliable Markdown-to-Telegram conversion without the hassle.

## Why This Library?

Working with Telegram's MarkdownV2 format can be frustrating - special characters need escaping, formatting rules are strict, and one wrong character breaks everything. This library handles all the complexity, letting you focus on your bot's functionality.

## Installation

```bash
bun install telegram-markdown-v2
```

Or with npm:
```bash
npm install telegram-markdown-v2
```

## Quick Start

```typescript
import { convert } from 'telegram-markdown-v2';

const markdown = `
# Hello World
This is **bold text** and *italic text*.
- List item 1
- List item 2
`;

const telegramMarkdown = convert(markdown);
console.log(telegramMarkdown);
```

## API Reference

### `convert(markdown: string, unsupportedTagsStrategy?: UnsupportedTagsStrategy): string`

Transforms standard Markdown into Telegram MarkdownV2 format.

**Parameters:**
- `markdown`: The input Markdown string
- `unsupportedTagsStrategy`: Optional strategy for handling unsupported tags (`'keep'` | `'escape'` | `'remove'`). Default: `'keep'`

**Returns:** Formatted string ready for Telegram's `parse_mode: 'MarkdownV2'`

## Supported Markdown Elements

| Element | Input | Telegram Output |
|---------|-------|----------------|
| **Bold** | `**text**` | `*text*` |
| *Italic* | `*text*` | `_text_` |
| __Underline__ | `<u>text</u>` | `__text__` |
| ~~Strikethrough~~ | `~~text~~` | `~text~` |
| Spoiler | `<span class="tg-spoiler">text</span>` | `||text||` |
| `Inline Code` | `` `code` `` | `` `code` `` |
| [Links](url) | `[text](url)` | `[text](url)` |
| Block Quotes | `> quote` | Configurable (keep/escape/remove) |
| Code Blocks | ``` ```lang code``` ``` | ``` ```code``` ``` |
| Lists | `- item` | `• item` |
| Headings | `# Title` | `*Title*` |

## Configuration Options

```typescript
type UnsupportedTagsStrategy = 'escape' | 'remove' | 'keep';
```

**Strategy Options:**
- `'keep'` (default): Preserve unsupported elements as-is
- `'escape'`: Escape special characters in unsupported elements  
- `'remove'`: Remove unsupported elements entirely

## Examples

### Basic Formatting
```typescript
import { convert } from 'telegram-markdown-v2';

const input = "Check out this **amazing** library with *great* features!";
const output = convert(input);
// Result: "Check out this *amazing* library with _great_ features\\!"
```

### Code Blocks
```typescript
const codeExample = `
Here's some JavaScript code:
\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`
`;

const formatted = convert(codeExample);
// Ready to send via Telegram Bot API
```

### Lists and Links
```typescript
const listExample = `
## Todo List
- Create awesome library
- Write documentation  
- Publish to npm

Visit [our repo](https://github.com/example/telegram-markdown-v2)
`;

const telegramReady = convert(listExample);
```

## Advanced Usage

### Unsupported Tags Strategy
```typescript
import { convert } from 'telegram-markdown-v2';

// Keep unsupported tags as-is (default)
const keepResult = convert('> This is a blockquote', 'keep');
// Result: "> This is a blockquote\n"

// Escape special characters in unsupported tags
const escapeResult = convert('> This is a blockquote', 'escape');
// Result: "\\> This is a blockquote\n"

// Remove unsupported tags entirely
const removeResult = convert('> This is a blockquote', 'remove');
// Result: ""
```

### Telegram V2 Specific Features
```typescript
// Underline support
const underline = convert('This is <u>underlined</u> text');
// Result: "This is __underlined__ text\n"

// Spoiler support
const spoiler = convert('This is <span class="tg-spoiler">hidden</span> text');
// Result: "This is ||hidden|| text\n"

// Custom emoji and user mentions
const mentions = convert('[John](tg://user?id=123) sent ![👍](tg://emoji?id=456)');
// Result: "[John](tg://user\\?id\\=123) sent [👍](tg://emoji\\?id\\=456)\n"
```

## Common Issues & Solutions

### Special Characters
The library automatically escapes Telegram's special characters: `_*[]()~`#+-=|{}.!`

### Message Length
Telegram limits messages to 4096 characters. You'll need to implement message splitting in your application.

### Formatting Conflicts
If your Markdown doesn't render correctly, check for unmatched formatting marks or nested styles.

### Unsupported Elements
Elements like tables, blockquotes, and HTML tags can be handled using the `unsupportedTagsStrategy` parameter.

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build for production
bun run build

# Type checking
bun run typecheck

# Linting
bun run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © 2025

## Acknowledgments

Inspired by the Python `telegramify-markdown` library, reimagined for the TypeScript ecosystem with modern tooling and better performance.
