import {parts} from '../transfer-kit-primitives.mjs';
import {layer,makeKit,layoutCSS} from '../transfer-kit-layout.mjs';
import {modules,recipes} from '../transfer-kit-recipes.mjs';
import {arrowStyles,labelVariants,semanticParts} from '../semantic-primitives.mjs';
const purposes={'truck-body':['transport'],'truck-cab':['transport'],wheel:['transport'],'cargo-box':['transport','collection'],'cargo-stack':['transport','collection'],warehouse:['warehouse','transport'],'ground-shadow':['annotation'],'photo-card':['file'],'photo-stack':['file','collection'],'window-shell':['window'],'buffer-area':['memory'],'chat-shell':['messages','window'],'chat-message':['messages'],'notice-paper':['noticeWriting','paper'],'notice-field':['noticeWriting','reuse','paper'],'folder-shell':['folder'],'attachment-card':['messages','file'],'reply-lines':['messages','text'],'send-icon':['messages','symbol'],'checklist-row':['verify','checkbox'],magnifier:['detail','verify'],'flow-arrow':['connector'],brace:['relation','connector'],'status-pill':['status'],title:['text'],'question-bubble':['clarify','annotation'],'brand-badge':['symbol'],'code-lines':['code'],'destination-pad':['warehouse','transport'],'focus-ring':['highlight']};
purposes.truck=['transport','batch'];
purposes['direction-arrow']=['direction','connector'];purposes['semantic-label']=['semanticLabel','text'];
export const components=[...parts.map(p=>{const s=Math.min(850/p.width,490/p.height,1.6),w=p.width*s,h=p.height*s;const component=makeKit('ani-atom-hd-'+p.key,'高清 · '+p.name,p.description,[layer('part',p.key,(1280-w)/2,(720-h)/2,w,h,p.defaults)],{layerType:'primitive',intentIds:purposes[p.key]||['annotation'],effect:'none'});if(p.hidden)component.hidden=true;if(p.compatibilityOnly)component.compatibilityOnly=true;return component;}),...modules,...recipes];
export const css=layoutCSS;
for(const spec of arrowStyles){
 const p=semanticParts.find(p=>p.key==='direction-arrow');
 components.push(makeKit('ani-atom-hd-arrow-'+spec.id,spec.name,`指向组件；${spec.geometry}路径；头部清晰。颜色、四向、线宽、头部像素和实例尺寸可调；与关联括线用途不同。`,[layer('arrow','direction-arrow',310,200,660,300,{...p.defaults,style:spec.id})],{layerType:'primitive',intentIds:['direction','connector'],effect:'none'}));
}
for(const spec of labelVariants){
 const p=semanticParts.find(p=>p.key==='semantic-label');
 components.push(makeKit('ani-atom-hd-label-'+spec.id,spec.name,`语义标注；适用${spec.roles.join('/')}。同一语义等级在整片冻结同款；字号使用实例像素，不随原生600×180比例缩小。`,[layer('label','semantic-label',240,260,800,180,{...p.defaults,variant:spec.id,text:spec.name,fontSize:40})],{layerType:'primitive',intentIds:['semanticLabel','text','annotation'],effect:'none'}));
}
