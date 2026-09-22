import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {normalizeMediaSequence} from '../mixed-media-motion.mjs';
const run=promisify(execFile);
export async function validateMediaFiles(props,duration,resolveAsset){
 const records=[];
 for(const shot of normalizeMediaSequence(props,duration).shots.flatMap(s=>[s,...s.mediaPanels])){
  const file=await resolveAsset(decodeURIComponent(shot.src));
  const {stdout}=await run(process.env.FFPROBE_PATH||'ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height:format=duration','-of','json',file],{windowsHide:true,maxBuffer:1024*1024});
  const probe=JSON.parse(stdout),stream=probe.streams?.[0];
  if(!stream||stream.width!==shot.width||stream.height!==shot.height)throw Error('Media dimensions differ from configuration: '+shot.src);
  const sourceDuration=Number(probe.format?.duration);
  if(shot.type==='video'&&(!Number.isFinite(sourceDuration)||shot.sourceStart+shot.mediaDuration>sourceDuration+.001))throw Error('Actual video is shorter than its requested source range: '+shot.src);
  records.push({src:shot.src,width:stream.width,height:stream.height,...(shot.type==='video'?{sourceDuration,sourceStart:shot.sourceStart,sourceEnd:shot.sourceStart+shot.mediaDuration}:{})});
 }return records;
}
