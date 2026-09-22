import assert from 'node:assert/strict';
import {cameraPose,normalizeMediaSequence} from '../mixed-media-motion.mjs';
let cases=0;
for(const [width,height]of [[1920,1080],[1080,1920],[892,514],[640,480]])for(const x of [0,.2,.5,.9,1])for(const y of [0,.4,1])for(const zoom of [1,1.5,2.4]){
  const source={width,height,fit:'cover',maxZoom:2.4},pose=cameraPose({width:1280,height:720},source,{x,y,zoom});
  assert.ok(pose.x<=.00001&&pose.y<=.00001);
  assert.ok(pose.x+width*pose.scale>=1280-.00001&&pose.y+height*pose.scale>=720-.00001,'cover cannot expose an edge');
  cases++;
}
const portrait=cameraPose({width:1280,height:720},{width:1080,height:1920,fit:'contain'},{x:.5,y:.5,zoom:1});
assert.equal(1920*portrait.scale,720);assert.equal(portrait.x,(1280-1080*portrait.scale)/2);
const base={media:[{src:'video.mp4',type:'video',width:1920,height:1080,start:0,end:1,sourceStart:2,sourceDuration:12}]};
assert.equal(normalizeMediaSequence(base,8).shots[0].sourceStart,2);
assert.equal(normalizeMediaSequence(base,8).shots[0].mediaDuration,8);
assert.throws(()=>normalizeMediaSequence(base,11),/exceeds source/);
const overlap={media:[{...base.media[0],sourceStart:0,sourceDuration:4,start:0,end:.5},{...base.media[0],sourceStart:0,start:.5,end:1,transition:'dissolve',transitionSeconds:.5}]};
assert.throws(()=>normalizeMediaSequence(overlap,8),/transition handles/);
assert.throws(()=>normalizeMediaSequence({media:[{...base.media[0],start:.1}]},8),/entire scene/);
assert.throws(()=>normalizeMediaSequence({media:[{...base.media[0],regions:[{x:.9,y:0,width:.2,height:.1}]}]},8),/fit source/);
console.log(JSON.stringify({ok:true,coverGeometries:cases,checks:['portrait aspect','source offset','video duration','transition handles','coverage','annotation bounds']}));
