export default {
  // Lint & Prettify TS and JS files
  '*.{js,jsx,ts,tsx}': (filenames) => [
    `npx prettier --write . ${filenames.join(' ')}`,
    `npm run lint --fix . ${filenames.join(' --file')}`
  ]
};
