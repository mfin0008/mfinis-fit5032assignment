// Ensures consistency between root/shared/constants.js and root/functions/shared/constants.js
// Functions does not allow imports from external directories, but still want to prevent code duplication.
// This allows for the constants to be shared between the front end and the cloud functions back end.

import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, '../shared/constants.js');
const dstDir = path.resolve(__dirname, '../functions/shared');
const dst = path.join(dstDir, 'constants.js');

fs.mkdirSync(dstDir, { recursive: true });
fs.copyFileSync(src, dst);
