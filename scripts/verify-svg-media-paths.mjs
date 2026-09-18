import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {normalizeMediaProps,rewriteRenderedMediaMarkup,rewriteRenderedSvgImageMarkup} from '../content-runtime.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const report={generatedAt:new Date().toISOString(),checks:[],ok:false};
const test=(name,fn)=>{try{fn();report.checks.push({name,ok:true});}catch(error){report.checks.push({name,ok:false,error:error.message});}};

test('imageSrc uses the existing project-relative encoding rules',()=>{
 const value=normalizeMediaProps({imageSrc:'assets/演示 图片.png',mediaSrc:'assets/office.mp4',media:{src:'assets/photo.jpg'}});
 assert.equal(value.imageSrc,'assets/%E6%BC%94%E7%A4%BA%20%E5%9B%BE%E7%89%87.png');
 assert.equal(value.mediaSrc,'assets/office.mp4');assert.equal(value.media.src,'assets/photo.jpg');
 assert.equal(normalizeMediaProps({nested:{imageSrc:'assets\\picture.png'}}).nested.imageSrc,'assets/picture.png');
 assert.equal(normalizeMediaProps({imageSrc:value.imageSrc}).imageSrc,value.imageSrc);
});
test('imageSrc rejects external, absolute, and directory-escape inputs',()=>{
 for(const value of ['https://example.com/photo.png','data:image/png;base64,AA','/assets/photo.png','../photo.png','assets/../../photo.png','assets/%2e%2e/photo.png','assets/%2foutside.png','C:\\outside.png'])assert.throws(()=>normalizeMediaProps({imageSrc:value}),undefined,value);
});
test('SVG href and xlink:href resolve against project root without duplicate prefixes',()=>{
 const source='<svg><image href="assets/photo.png"/><image xlink:href=\'assets/old.png\'/></svg>';
 const expected='<svg><image href="http://127.0.0.1:3031/assets/photo.png"/><image xlink:href=\'http://127.0.0.1:3031/assets/old.png\'/></svg>';
 assert.equal(rewriteRenderedMediaMarkup(source,'http://127.0.0.1:3031/'),expected);
 assert.equal(rewriteRenderedMediaMarkup(expected,'http://127.0.0.1:3031/'),expected);
 assert.equal(rewriteRenderedMediaMarkup('<image href="assets/photo.png"/>','../'),'<image href="../assets/photo.png"/>');
 assert.equal(rewriteRenderedMediaMarkup('<image href="assets/photo.png?a=1&amp;b=2"/>','http://localhost:3031/'),'<image href="http://localhost:3031/assets/photo.png?a=1&amp;b=2"/>');
});
test('SVG absolute, root-relative, embedded, and fragment hrefs stay unchanged',()=>{
 for(const href of ['/assets/photo.png','//example.com/photo.png','https://example.com/photo.png','data:image/png;base64,AA','#embedded-picture','']){
  const source='<svg><image href="'+href+'"/></svg>';assert.equal(rewriteRenderedMediaMarkup(source,'http://localhost:3031/'),source);
 }
 const unrelated='<svg><a href="docs/readme.html">Link</a><image data-href="assets/no.png" href="assets/yes.png"/></svg>';
 assert.equal(rewriteRenderedMediaMarkup(unrelated,'../'),'<svg><a href="docs/readme.html">Link</a><image data-href="assets/no.png" href="../assets/yes.png"/></svg>');
});
test('existing HTML media rewriting and catalog HTML media behavior are unchanged',()=>{
 const source='<img src="assets/a.png"><video src="assets/b.mp4"></video><audio src="assets/c.wav"></audio><source src="assets/d.webm"><img src="/assets/root.png"><img src="data:image/png;base64,AA">';
 const expected='<img src="../assets/a.png"><video src="../assets/b.mp4"></video><audio src="../assets/c.wav"></audio><source src="../assets/d.webm"><img src="/assets/root.png"><img src="data:image/png;base64,AA">';
 assert.equal(rewriteRenderedMediaMarkup(source,'../'),expected);
 assert.equal(rewriteRenderedSvgImageMarkup(source,'http://localhost:3031/'),source);
 assert.equal(rewriteRenderedMediaMarkup(source,''),source);
});

report.ok=report.checks.every(c=>c.ok);
const out=resolve(root,'reports/animation-style/svg-media-paths.json');await fs.mkdir(dirname(out),{recursive:true});await fs.writeFile(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));if(!report.ok)process.exitCode=1;
