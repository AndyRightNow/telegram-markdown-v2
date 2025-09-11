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
import { convertToTelegram } from 'telegram-markdown-v2';

const markdown = `
# Hello World
This is **bold text** and *italic text*.
- List item 1
- List item 2
`;

const telegramMarkdown = convertToTelegram(markdown);
console.log(telegramMarkdown);
```

## API Reference

### `convertToTelegram(markdown: string, options?: ConvertOptions): string`

Transforms standard Markdown into Telegram MarkdownV2 format.

**Parameters:**
- `markdown`: The input Markdown string
- `options`: Optional configuration object

**Returns:** Formatted string ready for Telegram's `parse_mode: 'MarkdownV2'`

### `escapeSpecialChars(text: string): string`

Escapes special characters that have meaning in Telegram MarkdownV2.

### `splitLongMessage(text: string, maxLength?: number): string[]`

Splits long messages while preserving formatting integrity.

## Supported Markdown Elements

| Element | Input | Telegram Output |
|---------|-------|----------------|
| **Bold** | `**text**` | `*text*` |
| *Italic* | `*text*` | `_text_` |
| ~~Strikethrough~~ | `~~text~~` | `~text~` |
| `Inline Code` | `` `code` `` | `` `code` `` |
| [Links](url) | `[text](url)` | `[text](url)` |
| Block Quotes | `> quote` | Properly escaped |
| Code Blocks | ``` ```lang code``` ``` | ``` ```lang code``` ``` |
| Lists | `- item` | `• item` |
| Headings | `# Title` | `*Title*` |

## Configuration Options

```typescript
interface ConvertOptions {
  escapeChars?: boolean;        // Auto-escape special chars (default: true)
  preserveLineBreaks?: boolean; // Keep original line breaks (default: false)
  maxLength?: number;           // Split messages at this length (default: 4096)
  headingStyle?: 'bold' | 'underline'; // How to render headings (default: 'bold')
}
```

## Examples

### Basic Formatting
```typescript
import { convertToTelegram } from 'telegram-markdown-v2';

const input = "Check out this **amazing** library with *great* features!";
const output = convertToTelegram(input);
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

const formatted = convertToTelegram(codeExample);
// Ready to send via Telegram Bot API
```

### Lists and Links
```typescript
const listExample = `
## Todo List
- [x] Create awesome library
- [ ] Write documentation  
- [ ] Publish to npm

Visit [our repo](https://github.com/example/telegram-markdown-v2)
`;

const telegramReady = convertToTelegram(listExample);
```

## Advanced Usage

### Custom Options
```typescript
const options = {
  headingStyle: 'underline' as const,
  maxLength: 2000,
  preserveLineBreaks: true
};

const result = convertToTelegram(markdown, options);
```

### Handling Long Messages
```typescript
import { splitLongMessage, convertToTelegram } from 'telegram-markdown-v2';

const longMarkdown = "... very long content ...";
const converted = convertToTelegram(longMarkdown);
const chunks = splitLongMessage(converted, 4000);

// Send each chunk separately
chunks.forEach(chunk => {
  bot.sendMessage(chatId, chunk, { parse_mode: 'MarkdownV2' });
});
```

## Common Issues & Solutions

### Special Characters
The library automatically escapes Telegram's special characters: `_*[]()~`#+-=|{}.!`

### Message Length
Telegram limits messages to 4096 characters. Use `splitLongMessage()` for longer content.

### Formatting Conflicts
If your Markdown doesn't render correctly, check for unmatched formatting marks or nested styles.

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

MIT © 2024

## Acknowledgments

Inspired by the Python `telegramify-markdown` library, reimagined for the TypeScript ecosystem with modern tooling and better performance.