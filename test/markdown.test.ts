import assert from "assert";
import {extractImages, replaceAllImages, replaceFirstAfter} from "../utils/markdown-parse";

const markdownString = `An [example](http://example.com).

![Image](Icon-pictures.png "icon")

> Markdown uses email-style
> characters for blockquoting.
> Multiple paragraphs need to be prepended individually.`;

const replacedMarkdown = `An [example](http://example.com).

![Image](asset\\1.png "icon")

> Markdown uses email-style
> characters for blockquoting.
> Multiple paragraphs need to be prepended individually.`

describe('markdown', () => {
  it('extractImages', () => {
    assert.deepEqual(extractImages(markdownString),
      [{
        index: 35,
        url: 'Icon-pictures.png',
        title: '"icon"',
        alt: 'Image'
      }])
  });
  it('replaceFirstAfter', () => {
    assert.equal(replaceFirstAfter('123123789', '123', "456", 3), '123456789')
  });
  it('replaceAllImages', () => {
    assert.equal(replaceAllImages(markdownString, {'asset\\1.png': 35}), replacedMarkdown)
  });
});
