import MarkdownIt from 'markdown-it'

const markdown = MarkdownIt({
  html: true,
  linkify: true,
  typography: true
}).use(require('markdown-it-video'))

export default markdown
