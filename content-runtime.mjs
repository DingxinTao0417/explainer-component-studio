// Shared by build output, per-instance bindings and the gallery. Inputs are project-root paths.
function normalizeLocalMediaPath(value) {
  const input=String(value||'').replaceAll('\\','/');
  if(!input)return '';
  if(/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(input)||/[\u0000-\u001f]/.test(input))throw Error('媒体必须使用工程内的相对路径');
  return input.split('/').map(segment=>{
    let decoded=segment;try{decoded=decodeURIComponent(segment);}catch{}
    if(decoded==='..'||decoded==='.'||decoded.includes('/')||decoded.includes('\\'))throw Error('媒体路径不能越过工程目录');
    return encodeURIComponent(decoded).replaceAll("'",'%27');
  }).join('/');
}
export function normalizeMediaProps(value, parentKey='') {
  if(Array.isArray(value))return value.map(v=>normalizeMediaProps(v,parentKey));
  if(!value||typeof value!=='object')return value;
  return Object.fromEntries(Object.entries(value).map(([key,item])=>{
    const isMedia=key==='mediaSrc'||key==='imageSrc'||(key==='src'&&/media/i.test(parentKey));
    return [key,isMedia?normalizeLocalMediaPath(item):normalizeMediaProps(item,key)];
  }));
}
export function resolveContentVariables(defaults, variables={}) {
  const merged={...defaults};
  for(const [key,value] of Object.entries(variables))if(key in defaults && value!==undefined)merged[key]=value;
  if(variables.propsJson){
    const overrides=typeof variables.propsJson==='string'?JSON.parse(variables.propsJson):variables.propsJson;
    if(!overrides||Array.isArray(overrides)||typeof overrides!=='object')throw Error('propsJson 必须是 JSON 对象');
    Object.assign(merged,overrides);
  }
  return normalizeMediaProps(merged);
}
export function rewriteRenderedMediaMarkup(html, mediaBase='') {
  if(!mediaBase)return html;
  const mediaMarkup=html.replace(/(<(?:img|video|audio|source)\b[^>]*\bsrc=")([^"]*)(")/gi,(_,a,src,b)=>{
    if(!src||/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(src))return a+src+b;
    const url=/^[a-z][a-z0-9+.-]*:/i.test(mediaBase)?new URL(src,mediaBase).href:mediaBase+src;
    return a+url.replaceAll('&','&amp;').replaceAll('"','&quot;')+b;
  });
  return rewriteRenderedSvgImageMarkup(mediaMarkup,mediaBase);
}

// SVG uses href rather than src. Keep this separate so the existing gallery's
// HTML media/base-tag behavior does not change when SVG images gain support.
export function rewriteRenderedSvgImageMarkup(html, mediaBase='') {
  if(!mediaBase)return html;
  return html.replace(/<image\b[^>]*>/gi,tag=>tag.replace(/(\s)((?:xlink:)?href)(\s*=\s*)(["'])(.*?)\4/gi,(_,space,name,equals,quote,src)=>{
    if(!src||/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(src))return space+name+equals+quote+src+quote;
    const decoded=src.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&apos;',"'");
    const url=/^[a-z][a-z0-9+.-]*:/i.test(mediaBase)?new URL(decoded,mediaBase).href:mediaBase+decoded;
    return space+name+equals+quote+url.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll("'",'&#39;')+quote;
  }));
}
