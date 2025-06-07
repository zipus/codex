#!/usr/bin/env node
import { pathToFileURL } from 'url';
import path from 'path';

const cliPath = path.resolve(__dirname, '../dist/remote-session.js');
const cliUrl = pathToFileURL(cliPath).href;

(async () => {
  try {
    await import(cliUrl);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
})();
