// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://sosolu.site',
  output: 'server',
  adapter: vercel(),
});
