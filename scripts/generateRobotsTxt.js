const fs = require('fs');
const path = require('path');

const dotenvResult = require('dotenv').config({
  path: path.resolve(path.dirname(path.dirname(__filename)), `.env.${process.env.GAMERARENA_STAGE}`),
});

if (dotenvResult.error) {
  throw dotenvResult.error;
}

function generateRobotsTxt() {
  const parts = [];

  if (process.env.NEXT_PUBLIC_GAMERARENA_STAGE === 'production') {
    parts.push(...[
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${process.env.NEXT_PUBLIC_GAMERARENA_FRONTEND_URL}/sitemap.xml`,
    ]);
  } else {
    parts.push(...[
      'User-agent: *',
      'Disallow: /',
      '',
      `Sitemap: ${process.env.NEXT_PUBLIC_GAMERARENA_FRONTEND_URL}/sitemap.xml`,
    ]);
  }

  fs.writeFileSync(path.resolve(process.cwd(), 'public', 'robots.txt'), parts.concat(['']).join('\n'));
}

generateRobotsTxt();
