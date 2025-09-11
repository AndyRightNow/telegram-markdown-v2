import { expect, test } from 'bun:test';
import { convert } from '../src/convert.js';

test('Text', () => {
  const markdown = 'Hello world!';
  const tgMarkdown = 'Hello world\\!\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Escaped text', () => {
  const markdown = 'Simple t`ext 2 + 2 * (32 / 32) = 4';
  const tgMarkdown = 'Simple t\\`ext 2 \\+ 2 \\* \\(32 / 32\\) \\= 4\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Headings', () => {
  const markdown = '# heading 1\n## heading 2\n### heading 3';
  const tgMarkdown = '*heading 1*\n\n*heading 2*\n\n*heading 3*\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Bold', () => {
  const markdown = '**bold text**';
  const tgMarkdown = `*bold text*\n`;
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Bold character in word', () => {
  expect(convert('he**l**lo')).toBe(`he*l*lo\n`);
});

test('Italic', () => {
  const markdown = '*italic text*';
  const tgMarkdown = `_italic text_\n`;
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Bold+Italic', () => {
  const markdown = '***bold+italic***';
  const tgMarkdown = `_*bold\\+italic*_\n`;
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Strike', () => {
  const markdown = '~~strike text~~';
  const tgMarkdown = `~strike text~\n`;
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Unordered list', () => {
  const markdown = '* list\n* list\n* list';
  const tgMarkdown = '•   list\n•   list\n•   list\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Ordered list', () => {
  const markdown = '1. list\n2. list\n3. list';
  const tgMarkdown = '1\\.  list\n2\\.  list\n3\\.  list\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Link with title', () => {
  const markdown = '[](http://atlassian.com "Atlas+sian")';
  const tgMarkdown = '[Atlas\\+sian](http://atlassian.com)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Link with alt', () => {
  const markdown = '[t.e.s+t](http://atlassian.com)';
  const tgMarkdown = '[t\\.e\\.s\\+t](http://atlassian.com)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Link with alt and title', () => {
  const markdown = '[test](http://atlassian.com "Atlassian")';
  const tgMarkdown = '[test](http://atlassian.com)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Link with no alt nor title', () => {
  const markdown = '[](http://atlassian.com)';
  const tgMarkdown = '[http://atlassian\\.com](http://atlassian.com)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Link with invalid URL', () => {
  const markdown = '[test](/atlassian)';
  const tgMarkdown = 'test\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Link with parentheses', () => {
  const markdown = '[Atlassian](http://atlas()sian.com)';
  const tgMarkdown = '[Atlassian](http://atlas\\(\\)sian.com)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Link in reference style with alt', () => {
  const markdown = '[Atlassian]\n\n[atlassian]: http://atlassian.com';
  const tgMarkdown = '[Atlassian](http://atlassian.com)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Link in reference style with alt and custom label', () => {
  const markdown = '[Atlassian][test]\n\n[test]: http://atlassian.com';
  const tgMarkdown = '[Atlassian](http://atlassian.com)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Link in reference style with title', () => {
  const markdown = '[][test]\n\n[test]: http://atlassian.com "Title"';
  const tgMarkdown = '[Title](http://atlassian.com)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Link in reference style with alt and title', () => {
  const markdown = '[Atlassian]\n\n[atlassian]: http://atlassian.com "Title"';
  const tgMarkdown = '[Atlassian](http://atlassian.com)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Link in reference style with invalid definition', () => {
  const markdown = '[Atlassian][test]\n\n[test]: /atlassian';
  const tgMarkdown = 'Atlassian\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Image with title', () => {
  const markdown = '![](https://bitbucket.org/repo/123/images/logo.png "test")';
  const tgMarkdown = '[test](https://bitbucket.org/repo/123/images/logo.png)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Image with alt', () => {
  const markdown =
    '![logo.png](https://bitbucket.org/repo/123/images/logo.png)';
  const tgMarkdown =
    '[logo\\.png](https://bitbucket.org/repo/123/images/logo.png)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Image with alt and title', () => {
  const markdown =
    "![logo.png](https://bitbucket.org/repo/123/images/logo.png 'test')";
  const tgMarkdown =
    '[logo\\.png](https://bitbucket.org/repo/123/images/logo.png)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Image with invalid URL', () => {
  const markdown = "![logo.png](/relative-path-logo.png 'test')";
  const tgMarkdown = 'logo\\.png\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Image in reference style with alt', () => {
  const markdown =
    '![Atlassian]\n\n[atlassian]: https://bitbucket.org/repo/123/images/logo.png';
  const tgMarkdown =
    '[Atlassian](https://bitbucket.org/repo/123/images/logo.png)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Image in reference style with alt and custom label', () => {
  const markdown =
    '![Atlassian][test]\n\n[test]: https://bitbucket.org/repo/123/images/logo.png';
  const tgMarkdown =
    '[Atlassian](https://bitbucket.org/repo/123/images/logo.png)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Image in reference style with title', () => {
  const markdown =
    '![][test]\n\n[test]: https://bitbucket.org/repo/123/images/logo.png "Title"';
  const tgMarkdown =
    '[Title](https://bitbucket.org/repo/123/images/logo.png)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Image in reference style with alt and title', () => {
  const markdown =
    '![Atlassian]\n\n[atlassian]: https://bitbucket.org/repo/123/images/logo.png "Title"';
  const tgMarkdown =
    '[Atlassian](https://bitbucket.org/repo/123/images/logo.png)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Image in reference style with invalid definition', () => {
  const markdown = '![Atlassian][test]\n\n[test]: /relative-path-logo.png';
  const tgMarkdown = 'Atlassian\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Inline code', () => {
  const markdown = 'hello `world`';
  const tgMarkdown = 'hello `world`\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Code block', () => {
  const markdown = '```\ncode block\n```';
  const tgMarkdown = '```\ncode block\n```\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Code block with newlines', () => {
  const markdown = '```\ncode\n\n\nblock\n```';
  const tgMarkdown = '```\ncode\n\n\nblock\n```\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Code block with language', () => {
  const markdown = '```javascript\ncode block\n```';
  const tgMarkdown = '```\ncode block\n```\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Code block with deprecated language declaration', () => {
  const markdown = '```\n#!javascript\ncode block\n```';
  const tgMarkdown = '```\ncode block\n```\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('User mention', () => {
  const markdown = '<@UPXGB22A2>';
  const tgMarkdown = '<@UPXGB22A2\\>\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('HTML Comment', () => {
  const markdown = '<!-- Comment -->';
  const tgMarkdown = '';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Bold text in lists', () => {
  const markdown =
    '- To make text **bold**, surround it with double asterisks (`**`): `**This text is bold.**`';
  const tgMarkdown =
    '•   To make text *bold*, surround it with double asterisks \\(`**`\\): `**This text is bold.**`\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Code after list', () => {
  const markdown = `1. Foo:\n\n\`\`\`\nBar\n\`\`\``;
  const tgMarkdown = `1\\.  Foo:\n\n\n\`\`\`\nBar\n\`\`\`\n`;
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Multiple code blocks and lists', () => {
  const markdown = `1. Foo:\n\n\`\`\`\nBar\n\`\`\`\n\n2. Baz:\n\n\`\`\`\nQux\n\`\`\``;
  const tgMarkdown = `1\\.  Foo:\n\n\n\`\`\`\nBar\n\`\`\`\n\n2\\.  Baz:\n\n\n\`\`\`\nQux\n\`\`\`\n`;
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Nested codeblocks', () => {
  const markdown = `
\`\`\`\`markdown

\`\`\`python
foo = 'bar'
\`\`\`

\`\`\`\`

  `;
  const tgMarkdown = `\`\`\`

\\\`\\\`\\\`python
foo = 'bar'
\\\`\\\`\\\`

\`\`\`
`;
  expect(convert(markdown)).toBe(tgMarkdown);
});

// Telegram Markdown V2 specific tests
test('Telegram V2: Underline support', () => {
  // This would require custom parser extensions for underline
  // For now, this test demonstrates what actually happens
  const markdown = '__underline__';
  // Since standard markdown doesn't have underline, __ gets treated as strong (bold)
  const tgMarkdown = '*underline*\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Telegram V2: Special character escaping', () => {
  const markdown = 'Test with {braces} and |pipes| and =equals=';
  const tgMarkdown =
    'Test with \\{braces\\} and \\|pipes\\| and \\=equals\\=\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

// Tests for unsupported tags strategy
test('Escape unsupported tags: blockquote', () => {
  const markdown = '> test';
  const tgMarkdown = '\\> test\n';
  expect(convert(markdown, 'escape')).toBe(tgMarkdown);
});

test('Escape unsupported tags: html', () => {
  const markdown = '<div></div>';
  const tgMarkdown = '<div\\></div\\>\n';
  expect(convert(markdown, 'escape')).toBe(tgMarkdown);
});

test('Escape unsupported tags: table', () => {
  const markdown = `| a | b | c | d |
| - | :- | -: | :-: |
| e | f |
| g | h | i | j | k |`;
  const tgMarkdown = `\\| a \\| b  \\|  c \\|  d  \\|   \\|
\\| \\- \\| :\\- \\| \\-: \\| :\\-: \\| \\- \\|
\\| e \\| f  \\|    \\|     \\|   \\|
\\| g \\| h  \\|  i \\|  j  \\| k \\|
`;
  expect(convert(markdown, 'escape')).toBe(tgMarkdown);
});

test('Remove unsupported tags: blockquote', () => {
  const markdown = '> test';
  const tgMarkdown = '';
  expect(convert(markdown, 'remove')).toBe(tgMarkdown);
});

test('Remove unsupported tags: html', () => {
  const markdown = '<div></div>';
  const tgMarkdown = '';
  expect(convert(markdown, 'remove')).toBe(tgMarkdown);
});

test('Remove unsupported tags: table', () => {
  const markdown = `| a | b | c | d |
| - | :- | -: | :-: |
| e | f |
| g | h | i | j | k |`;
  const tgMarkdown = '';
  expect(convert(markdown, 'remove')).toBe(tgMarkdown);
});

// Telegram Markdown V2 specific tests
test('Underline support with HTML <u> tags', () => {
  const markdown = 'This is <u>underlined</u> text';
  const tgMarkdown = 'This is __underlined__ text\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Spoiler support with HTML <span> tags', () => {
  const markdown = 'This is <span class="tg-spoiler">spoiler</span> text';
  const tgMarkdown = 'This is ||spoiler|| text\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Combined underline and spoiler', () => {
  const markdown =
    'Text with <u>underline</u> and <span class="tg-spoiler">spoiler</span>';
  const tgMarkdown = 'Text with __underline__ and ||spoiler||\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Nested formatting with underline', () => {
  const markdown = '<u>**bold underline**</u>';
  const tgMarkdown = '__*bold underline*__\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Custom emoji links', () => {
  const markdown = '![👍](tg://emoji?id=5789)';
  const tgMarkdown = '[👍](tg://emoji\\?id\\=5789)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('User mention links', () => {
  const markdown = '[John Doe](tg://user?id=123456)';
  const tgMarkdown = '[John Doe](tg://user\\?id\\=123456)\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Multiple V2 features combined', () => {
  const markdown = `
**Bold** _italic_ <u>underline</u> <span class="tg-spoiler">spoiler</span>
\`code\` and [user](tg://user?id=123)
> Quote with ![👍](tg://emoji?id=456)
  `.trim();
  const tgMarkdown = `*Bold* _italic_ __underline__ ||spoiler||
\`code\` and [user](tg://user\\?id\\=123)

> Quote with [👍](tg://emoji\\?id\\=456)
`;
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Escaping in V2 features', () => {
  const markdown = '<u>under_line_test</u>';
  const tgMarkdown = '__under\\_line\\_test__\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});

test('Complex nesting with all V2 features', () => {
  const markdown = '***<u><span class="tg-spoiler">nested</span></u>***';
  const tgMarkdown = '_*__||nested||__*_\n';
  expect(convert(markdown)).toBe(tgMarkdown);
});
