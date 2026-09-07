import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { rehypeArticle } from './src/plugins/rehype-article.mjs';

export default defineConfig({
  site: 'https://itsgordonhui.com',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    // gfm stays on, which is what renders the article's footnotes.
    processor: unified({ rehypePlugins: [rehypeArticle] }),
  },
  build: {
    format: 'directory',
  },
});
