// Identical PCM calculation in the browser gallery and portable export.
export function mixPCM(duration,cues,sources){
 const rate=48000,mix=new Float32Array(Math.round(duration*rate)),used=[];
 for(const cue of cues){
  const source=sources.get(cue.sound);if(!source)throw Error('Unknown sound: '+cue.sound);
  const at=cue.at,gain=cue.gain??source.defaultGain??.5;
  if(!Number.isFinite(at)||at<0||at>=duration||!Number.isFinite(gain)||gain<0||gain>1)throw Error('Invalid scene sound cue');
  const requested=cue.duration??source.samples.length/source.rate;
  if(!Number.isFinite(requested)||requested<=0)throw Error('Invalid sound duration');
  const length=Math.min(source.samples.length/source.rate,requested,duration-at),frames=Math.floor(length*rate),offset=Math.round(at*rate),fade=Math.min(.012,length*.12);
  for(let i=0;i<frames&&offset+i<mix.length;i++){
   const pos=i*source.rate/rate,lo=Math.floor(pos),f=pos-lo,envelope=Math.max(0,Math.min(1,i/rate/fade,(frames-1-i)/rate/fade));
   mix[offset+i]+=((source.samples[lo]||0)*(1-f)+(source.samples[lo+1]||0)*f)*gain*envelope;
  }
  used.push({...cue,at,duration:length,gain,source:source.src,license:source.license,provenance:source.provenance});
 }
 let peak=0;for(const x of mix)peak=Math.max(peak,Math.abs(x));const scale=peak>10**(-3/20)?10**(-3/20)/peak:1;
 if(scale<1)for(let i=0;i<mix.length;i++)mix[i]*=scale;
 const bytes=new Uint8Array(44+mix.length*2),v=new DataView(bytes.buffer),tag=(at,s)=>[...s].forEach((c,i)=>v.setUint8(at+i,c.charCodeAt(0)));
 tag(0,'RIFF');v.setUint32(4,bytes.length-8,true);tag(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);tag(36,'data');v.setUint32(40,mix.length*2,true);
 for(let i=0;i<mix.length;i++)v.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(.999969,mix[i]))*32768),true);
 return {bytes,cues:used,sampleRate:rate,peak:peak*scale};
}
export function decodePCM(bytes){
 const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),tag=(at,n)=>String.fromCharCode(...bytes.subarray(at,at+n));
 if(tag(0,4)!=='RIFF'||tag(8,4)!=='WAVE')throw Error('Only PCM WAV is supported');
 let fmt,data,length;
 for(let at=12;at+8<=bytes.length;){const len=v.getUint32(at+4,true);if(tag(at,4)==='fmt ')fmt=at+8;if(tag(at,4)==='data'){data=at+8;length=len;}at+=8+len+len%2;}
 if(!fmt||!data||v.getUint16(fmt,true)!==1||v.getUint16(fmt+14,true)!==16||data+length>bytes.length)throw Error('Need PCM16 WAV');
 const channels=v.getUint16(fmt+2,true),rate=v.getUint32(fmt+4,true),samples=new Float32Array(Math.floor(length/(channels*2)));
 for(let i=0;i<samples.length;i++)for(let c=0;c<channels;c++)samples[i]+=v.getInt16(data+(i*channels+c)*2,true)/32768/channels;
 return {samples,rate};
}
export async function previewSoundtrack(duration,cues,sounds){
 const sources=new Map();
 await Promise.all([...new Set(cues.map(c=>c.sound))].map(async id=>{
  const meta=sounds.find(s=>s.id===id);if(!meta)throw Error('Unknown sound: '+id);
  const response=await fetch(meta.src);if(!response.ok)throw Error('Missing sound '+meta.src);
  sources.set(id,{...meta,...decodePCM(new Uint8Array(await response.arrayBuffer()))});
 }));
 const result=mixPCM(duration,cues,sources);return URL.createObjectURL(new Blob([result.bytes],{type:'audio/wav'}));
}
