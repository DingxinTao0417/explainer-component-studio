import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {effects} from '../animations.mjs';
import {sounds} from '../sound-assets.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),RATE=48000;
function decodeWav(buffer){
 if(buffer.toString('ascii',0,4)!=='RIFF'||buffer.toString('ascii',8,12)!=='WAVE')throw Error('仅接受PCM WAV');
 let fmt,data;for(let at=12;at+8<=buffer.length;){const name=buffer.toString('ascii',at,at+4),len=buffer.readUInt32LE(at+4),payload=buffer.subarray(at+8,at+8+len);if(name==='fmt ')fmt=payload;if(name==='data')data=payload;at+=8+len+(len%2);}
 if(!fmt||!data||fmt.readUInt16LE(0)!==1||fmt.readUInt16LE(14)!==16)throw Error('需要PCM16 WAV');
 const channels=fmt.readUInt16LE(2),rate=fmt.readUInt32LE(4),length=Math.floor(data.length/(channels*2)),samples=new Float32Array(length);
 for(let i=0;i<length;i++){for(let c=0;c<channels;c++)samples[i]+=data.readInt16LE((i*channels+c)*2)/32768/channels;}
 return {samples,rate};
}
function encodeWav(samples){const out=Buffer.alloc(44+samples.length*2);out.write('RIFF');out.writeUInt32LE(out.length-8,4);out.write('WAVEfmt ',8);out.writeUInt32LE(16,16);out.writeUInt16LE(1,20);out.writeUInt16LE(1,22);out.writeUInt32LE(RATE,24);out.writeUInt32LE(RATE*2,28);out.writeUInt16LE(2,32);out.writeUInt16LE(16,34);out.write('data',36);out.writeUInt32LE(samples.length*2,40);for(let i=0;i<samples.length;i++)out.writeInt16LE(Math.round(Math.max(-1,Math.min(.999969,samples[i]))*32768),44+i*2);return out;}
export async function mixSoundtracks(){
 await mkdir(resolve(root,'assets/sfx/tracks'),{recursive:true});const decoded=new Map();
 const catalog=[];
 for(const s of sounds){const d=decodeWav(await readFile(resolve(root,s.src)));decoded.set(s.id,{...d,...s});const waveform=Array.from({length:48},(_,i)=>{let peak=0;for(let j=Math.floor(i*d.samples.length/48);j<Math.floor((i+1)*d.samples.length/48);j++)peak=Math.max(peak,Math.abs(d.samples[j]));return Number(peak.toFixed(4));});catalog.push({...s,waveform});}
 const reports=[];
 for(const effect of [{id:'none',duration:8,cueHints:[]},...effects]){
  const duration=Number(effect.duration||8),mix=new Float32Array(Math.round(duration*RATE)),cues=[];
  for(const hint of effect.cueHints||[]){const source=decoded.get(hint.sound);if(!source)throw Error(`${effect.id}: 缺音效 ${hint.sound}`);const at=Number(hint.at),gain=Number(hint.gain??source.defaultGain??.5);if(at<0||at>=duration||!Number.isFinite(gain))throw Error(`${effect.id}: 音效时间或音量无效`);const length=Math.min(source.samples.length/source.rate,Number(hint.duration??Infinity),duration-at);const frames=Math.floor(length*RATE),offset=Math.round(at*RATE);const fade=Math.min(.012,length*.12);for(let i=0;i<frames&&offset+i<mix.length;i++){const pos=i*source.rate/RATE,lo=Math.floor(pos),f=pos-lo;const value=(source.samples[lo]||0)*(1-f)+(source.samples[lo+1]||0)*f;const envelope=Math.min(1,i/RATE/fade,(frames-1-i)/RATE/fade);mix[offset+i]+=value*gain*Math.max(0,envelope);}cues.push({sound:source.id,name:source.name,at,duration:Number(length.toFixed(4)),gain});}
  let peak=0,power=0;for(const s of mix){peak=Math.max(peak,Math.abs(s));power+=s*s;}const ceiling=Math.pow(10,-3/20),scale=peak>ceiling?ceiling/peak:1;if(scale<1)for(let i=0;i<mix.length;i++)mix[i]*=scale;
  const file=`assets/sfx/tracks/${effect.id}.wav`;await writeFile(resolve(root,file),encodeWav(mix));const onset=mix.findIndex(x=>Math.abs(x)>.0001);
  reports.push({id:effect.id,src:file,duration,sampleRate:RATE,channels:1,cues,peak:Number((peak*scale).toFixed(6)),peakDb:peak?Number((20*Math.log10(peak*scale)).toFixed(2)):null,rms:Math.sqrt(power/mix.length)*scale,onset:onset<0?null:onset/RATE,ceilingScale:scale});
 }
 await writeFile(resolve(root,'assets/sfx/tracks.json'),JSON.stringify({version:1,sounds:catalog,tracks:reports},null,2)+'\n');
 await writeFile(resolve(root,'reports/soundtracks.json'),JSON.stringify({clipCeilingDb:-3,sampleRate:RATE,tracks:reports},null,2)+'\n');
 return {sounds:catalog,tracks:reports};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){const result=await mixSoundtracks();console.log(`Mixed ${result.tracks.length-1} soundtracks + static silence. No video rendered.`);}
