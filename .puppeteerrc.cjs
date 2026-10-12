/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Skip Chromium download in CI and Vercel build environments
  skipDownload: Boolean(process.env.VERCEL || process.env.CI || process.env.NODE_ENV === 'production'),
};
