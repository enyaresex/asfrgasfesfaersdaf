const fs = require('fs');
const path = require('path');
const globby = require('globby');

const dotenvResult = require('dotenv').config({
  path: path.resolve(process.cwd(), `.env.${process.env.GAMERARENA_STAGE}`),
});

if (dotenvResult.error) {
  throw dotenvResult.error;
}

function generateSitemap() {
  const pathNames = [];

  // common pages
  const commonPages = globby.sync([
    './pages/**/index.tsx',
    '!./pages/_**/index.tsx',
  ]);

  commonPages.forEach((p) => {
    const pathname = p.slice(8, -10);

    pathNames.push(`/${pathname}`);
  });

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  pathNames.forEach((p) => {
    // eslint-disable-next-line max-len
    sitemap += `<url><loc>${process.env.NEXT_PUBLIC_GAMERARENA_FRONTEND_URL}${p}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`;
  });

  sitemap += '</urlset>';

  fs.writeFileSync(path.resolve(process.cwd(), 'public', 'sitemap.xml'), sitemap);
}

generateSitemap();
