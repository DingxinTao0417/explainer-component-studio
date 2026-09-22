import {copyFile, cp, lstat, mkdir, readdir, rm} from 'node:fs/promises';
import {dirname, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'public');

// Keep the existing component/HyperFrames build available to local authors.
await import('./build.mjs');

// Only this generated directory may be removed; never follow a linked output.
if (dirname(output) !== root || relative(root, output) !== 'public') {
  throw new Error('Static output must be the public directory inside this project.');
}
const previous = await lstat(output).catch(error => {
  if (error.code !== 'ENOENT') throw error;
});
if (previous?.isSymbolicLink() || (previous && !previous.isDirectory())) {
  throw new Error('Refusing to replace a linked or non-directory public output.');
}
await rm(output, {recursive: true, force: true});
await mkdir(output, {recursive: true});

// The catalog and demos import the root module graph directly. Discover these
// files so new component families cannot be omitted from the static deployment.
// Skills, installers, credentials and authoring reports remain outside public/.
const modules = (await readdir(root, {withFileTypes: true}))
  .filter(entry => entry.isFile() && /\.(?:mjs|js|css)$/.test(entry.name))
  .map(entry => entry.name);
const files = [
  ...modules, 'catalog.html', 'transfer-kit.html', 'manifest.json', 'meta.json',
  'transfer-kit-index.json', 'TRANSFER_KIT_GUIDE.md', 'SEMANTIC_ANNOTATIONS_GUIDE.md',
];
const directories = [
  'assets', 'compositions', 'content', 'demos', 'effects', 'examples',
  'families', 'previews', 'references', 'snapshots', 'vendor',
];
const excluded = new Set(['node_modules', 'reports', 'proof']);
const filter = async source => {
  const segments = relative(root, source).split(/[\\/]/);
  if (segments.some(part => part.startsWith('.') || excluded.has(part))) return false;
  if ((await lstat(source)).isSymbolicLink()) {
    throw new Error(`Linked files cannot be published: ${relative(root, source)}`);
  }
  return true;
};
for (const file of files) await copyFile(resolve(root, file), resolve(output, file));
for (const directory of directories) {
  await cp(resolve(root, directory), resolve(output, directory), {recursive: true, filter});
}

// The local server maps / to the catalog; static hosts need a real index page.
await copyFile(resolve(root, 'catalog.html'), resolve(output, 'index.html'));
const entries = await readdir(output, {recursive: true, withFileTypes: true});
console.log(`Static site: public/ (${entries.filter(entry => entry.isFile()).length} files). Homepage: component catalog.`);
