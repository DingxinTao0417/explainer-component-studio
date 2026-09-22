import {helpers} from './shared.mjs';

// The library's selectors use this deliberately small CSS subset. Unsupported
// syntax fails closed; a browser parity test covers every registered selector.
export function markupMatches(markup, selector) {
  const root={tag:'div',attrs:{class:'motion-wrap'},parent:null,children:[]},nodes=[root],stack=[root];
  const voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
  for(const token of markup.matchAll(/<!--[\s\S]*?-->|<\/?([a-z][\w:-]*)\b([^>]*?)>/gi)) {
    if(!token[1])continue;
    const tag=token[1].toLowerCase();
    if(token[0].startsWith('</')){for(let i=stack.length-1;i>0;i--)if(stack[i].tag===tag){stack.length=i;break;}continue;}
    const attrs={};for(const a of token[2].matchAll(/([^\s=/'"<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s'"=<>`]+)))?/g))attrs[a[1]]=a[2]??a[3]??a[4]??'';
    const node={tag,attrs,parent:stack.at(-1),children:[]};node.parent.children.push(node);nodes.push(node);
    if(!voids.has(tag)&&!token[0].endsWith('/>'))stack.push(node);
  }
  const atom=(node,s)=>{
    if(!node)return false;
    const tag=/^(\*|[a-z][\w-]*)/i.exec(s);if(tag){if(tag[1]!=='*'&&node.tag!==tag[1].toLowerCase())return false;s=s.slice(tag[0].length);}
    while(s){let m;
      if((m=/^\.([\w-]+)/.exec(s))){if(!(node.attrs.class||'').split(/\s+/).includes(m[1]))return false;}
      else if((m=/^#([\w-]+)/.exec(s))){if(node.attrs.id!==m[1])return false;}
      else if((m=/^\[([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\]]+)))?\]/.exec(s))){if(!(m[1] in node.attrs))return false;const v=m[2]??m[3]??m[4];if(v!==undefined&&node.attrs[m[1]]!==v)return false;}
      else return false;
      s=s.slice(m[0].length);
    }return true;
  };
  return String(selector||'').split(',').some(branch=>{
    const tokens=branch.trim().replace(/\s*>\s*/g,' > ').split(/\s+/).filter(Boolean);
    const match=(node,i)=>{
      if(i<0)return true;if(!atom(node,tokens[i]))return false;if(i===0)return true;
      if(tokens[i-1]==='>')return match(node.parent,i-2);
      for(let p=node.parent;p;p=p.parent)if(match(p,i-1))return true;return false;
    };
    return tokens.length>0&&nodes.some(node=>match(node,tokens.length-1));
  });
}

const familyAliases={
  'slide-in':'slide','slide-out-left':'slide','shared-slide':'slide',
  'zoom-focus':'zoom','zoom-out-reveal':'zoom','zoom-through':'zoom','micro-dolly':'zoom','frame-push':'zoom',
  'fade-in':'fade','fade-out':'fade','soft-dissolve':'dissolve',
  'wipe-transition':'wipe','curve-ribbon':'wipe','diagonal-ribbon':'wipe','liquid-sweep':'wipe',
};
export function describeEffect(effect) {
  if(!effect||effect.id==='none')return {role:'still',family:'still',controls:[],optionsSchema:{type:'object',properties:{},additionalProperties:false},requiresNextScene:false};
  const role=effect.category==='背景'?'background':effect.category==='转场'?'transition':effect.exclusive||effect.id.startsWith('ani-')?'internal':effect.selector==='.motion-wrap'?'wrapper':'target';
  const properties={};
  if(!['internal'].includes(role)&&effect.id!=='media-sequence-motion')properties.background={type:'string',description:'背景效果 ID；仅作用于声明 background 目标的组件'};
  if(!effect.exclusive&&!effect.id.startsWith('ani-'))properties.selector={type:'string',description:'显式目标；必须匹配实际内容，不能覆盖混剪媒体世界'};
  if(effect.id==='zoom-focus')properties.scale={type:'number',minimum:1,maximum:3,default:1.32};
  if(effect.id==='scroll-panel')properties.distance={type:'number',minimum:0};
  if(effect.id==='ani-machine-process')properties.travelDistance={type:'number',description:'输入材料到处理装置的移动距离；仅在组件布局仍保留真实目标时调整'};
  if(['callout-pin','success-toast','save-pulse'].includes(effect.id))properties.label={type:'string',description:'替换反馈或标注文字；不改变动作锚点'};
  if(role==='transition')properties.nextScene={type:'object',required:['component'],properties:{component:{type:'string'},props:{type:'object'}},additionalProperties:false};
  Object.assign(properties,effect.optionsSchema?.properties||{});
  return {role,family:familyAliases[effect.id]||effect.motionFamily||effect.id,
    controls:role==='background'?['background']:effect.id==='media-sequence-motion'?['source-camera','source-annotations','media-viewports']:role==='wrapper'||role==='transition'?['motion-wrap']:['component-targets'],
    excludes:effect.id==='media-sequence-motion'?['another camera on .mm-world']:role==='internal'?['another timeline controlling the same component targets']:[],
    replacesDefault:true,requiresNextScene:role==='transition',optionsSchema:{type:'object',properties,additionalProperties:false},
    timing:effect.id==='media-sequence-motion'?'source-clock':'native-8s-retime',silent:effect.silent===true,
    soundCues:effect.soundCues||effect.cueHints||[],
  };
}

export function effectCompatibility(component,effect,props=component.defaults,{selector}={}) {
  const id=effect?.id||'none',contract=describeEffect(effect),warnings=[];
  const reject=reason=>({compatible:false,reason,warnings,...contract});
  if(component.id==='mixed-media-sequence'&&id!=='media-sequence-motion')return reject('混剪组件必须保持源时钟；静止取景使用 props.strength=still');
  if(effect?.exclusive&&effect.exclusive!==component.id)return reject('专属效果仅适用于 '+effect.exclusive);
  if(id!=='none') {
    let markup;try{markup=component.render(props,helpers('contract-probe'));}catch(e){return reject('内容不能渲染：'+e.message);}
    if(!markupMatches(markup,selector||effect.selector))return reject('当前内容没有效果目标 '+(selector||effect.selector));
  }
  if(component.defaultEffect&&component.defaultEffect!=='none'&&id!==component.defaultEffect)warnings.push('此选择替换默认内部动作；不会叠加默认动作。核对讲解步骤，静态内容可能直接显示终态。');
  return {compatible:true,reason:id==='none'?'静态阅读':effect?.exclusive?'组件专属动作':contract.role==='transition'?'目标存在；还需显式提供下一画面':'当前内容含实际目标',warnings,...contract};
}

export function compatibleEffects(component,effects,props=component.defaults) {
  return [{id:'none',name:'静态阅读'},...effects].map(e=>({id:e.id,name:e.name,...effectCompatibility(component,e,props)})).filter(e=>e.compatible);
}
