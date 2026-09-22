// Instance-only visual controls. No shared defaults are changed by a tune call.
export const styleDefaults={palette:{accent:'',ink:'',surface:'',mint:'',orange:''},fontScale:1,fontFamily:'original',strokeScale:1,shadowOpacity:1,shadowBlur:0,opacity:1};
const color={type:'string',pattern:'^(|#[0-9a-fA-F]{6})$'};
export const styleSchema={type:'object',additionalProperties:false,properties:{palette:{type:'object',additionalProperties:false,properties:Object.fromEntries(Object.keys(styleDefaults.palette).map(k=>[k,color]))},fontScale:{type:'number',minimum:.8,maximum:1.25},fontFamily:{type:'string',enum:['original','Microsoft YaHei','Segoe UI','SimHei']},strokeScale:{type:'number',minimum:.5,maximum:2},shadowOpacity:{type:'number',minimum:0,maximum:1},shadowBlur:{type:'number',minimum:0,maximum:12},opacity:{type:'number',minimum:0,maximum:1}},description:'Instance style. Palette keeps source luminance/highlights, font sizes scale without moving anchors, stroke weight scales, shadow only targets declared shadow nodes. Verify text fit after increasing fonts.'};
export function resolveStyle(base={},local={}){
 function check(p,s,path){if(!p||typeof p!=='object'||Array.isArray(p))throw Error(path+' must be an object');for(const [k,v]of Object.entries(p)){const rule=s.properties[k];if(!rule)throw Error(path+'.'+k+' is not supported');if(rule.type==='object'){check(v,rule,path+'.'+k);continue;}if(typeof v!==rule.type||rule.type==='number'&&(!Number.isFinite(v)||v<rule.minimum||v>rule.maximum)||rule.enum&&!rule.enum.includes(v)||rule.pattern&&!new RegExp(rule.pattern).test(v))throw Error(path+'.'+k+' is outside the supported style contract');}}
 check(base,styleSchema,'style');check(local,styleSchema,'layer.style');return {...styleDefaults,...base,...local,palette:{...styleDefaults.palette,...base.palette,...local.palette}};
}
function hsl(hex){const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255),max=Math.max(...rgb),min=Math.min(...rgb),d=max-min,l=(max+min)/2;let h=0,s=0;if(d){s=d/(1-Math.abs(2*l-1));h=max===rgb[0]?((rgb[1]-rgb[2])/d+6)%6:max===rgb[1]?(rgb[2]-rgb[0])/d+2:(rgb[0]-rgb[1])/d+4;h*=60;}return {h,s,l};}
function rgb({h,s,l}){const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1)))).toString(16).padStart(2,'0');};return '#'+f(0)+f(8)+f(4);}
function recolor(hex,p){const c=hsl(hex);if(c.s<.12)return hex;const key=c.h>=180&&c.h<=255?(c.l<.26?'ink':c.l>.87?'surface':'accent'):c.h>=15&&c.h<=65?'orange':c.h>65&&c.h<180?'mint':null;if(!key||!p[key])return hex;const t=hsl(p[key]);return rgb({h:t.h,s:t.s,l:Math.max(.05,Math.min(.98,c.l+(t.l-.5)*.35))});}
export function styleMarkup(markup,input,h){
 const s=resolveStyle(input);let out=markup.replace(/\b(fill|stroke|stop-color)="(#[0-9a-fA-F]{6})"/g,(_,a,c)=>`${a}="${recolor(c,s.palette)}"`);
 if(s.fontScale!==1)out=out.replace(/font-size="([\d.]+)"/g,(_,n)=>`font-size="${(Number(n)*s.fontScale).toFixed(3)}"`);
 if(s.fontFamily!=='original')out=out.replace(/<text\b/g,`<text style="font-family:'${s.fontFamily}',sans-serif"`);
 if(s.strokeScale!==1)out=out.replace(/stroke-width="([\d.]+)"/g,(_,n)=>`stroke-width="${(Number(n)*s.strokeScale).toFixed(3)}"`);
 const id=h.uid('style-shadow');
 out=out.replace(/<g data-kit-node="shadow"/g,`<g opacity="${s.shadowOpacity}"${s.shadowBlur?` filter="url(#${id})"`:''} data-kit-node="shadow"`);
 return `${s.shadowBlur?`<defs><filter id="${id}" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="${s.shadowBlur}"/></filter></defs>`:''}<g data-kit-style="instance" opacity="${s.opacity}">${out}</g>`;
}
