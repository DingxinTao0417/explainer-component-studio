// Shared editorial structures, with deliberately finite layout choices.
// Source/result HTML is authored by the family renderers, never accepted as props.
export const workflowLayouts=Object.freeze({
 scan:{sourceSide:['left','right'],resultLayout:['rows','cards']},
 search:{sourceSide:['left','right']},
 voice:{sourceSide:['left','right'],resultLayout:['rows','cards']},
});
export function workflowChoice(value,allowed,path){
 if(!allowed.includes(value))throw Error(`${path}: expected ${allowed.join(' | ')}`);return value;
}
export function workflowItems(value,path,min,max){
 if(!Array.isArray(value)||value.length<min||value.length>max)throw Error(`${path}: requires ${min}–${max} items; content is never silently truncated`);
 return value;
}
export function workflowColumns(kind,props,{source,result,connector=''}){
 const layout=workflowLayouts[kind];if(!layout)throw Error('Unknown workflow layout: '+kind);
 const side=workflowChoice(props.sourceSide??'left',layout.sourceSide,'sourceSide');
 const resultLayout=layout.resultLayout?workflowChoice(props.resultLayout??'rows',layout.resultLayout,'resultLayout'):'rows';
 return `<div class="brw-body brw-${kind}" data-workflow-layout="${kind}" data-source-side="${side}" data-result-layout="${resultLayout}">${source}${connector}${result}</div>`;
}
export function workflowResultItems(items,{kind,layout='rows'},h){
 workflowChoice(kind,['fields','transcript'],'result kind');workflowChoice(layout,['rows','cards'],'resultLayout');
 return items.map(item=>kind==='fields'
  ?`<div class="brw-field" data-motion="item" data-broll-part="result"><span>${h.esc(item.label)}</span><strong>${h.esc(item.value)}</strong></div>`
  :`<div class="brw-transcript-line" data-motion="item" data-broll-part="transcript"><span>${h.esc(item.time)}</span><p>${h.esc(item.text)}</p></div>`).join('');
}
export const workflowLayoutCSS=`
[data-workflow-layout][data-source-side="right"]>[data-workflow-slot="source"]{grid-column:2;grid-row:1}
[data-workflow-layout][data-source-side="right"]>[data-workflow-slot="result"]{grid-column:1;grid-row:1}
.brw-scan[data-source-side="right"]>[data-workflow-slot="source"]{grid-column:3}
.brw-scan[data-source-side="right"]>.brw-transfer{grid-column:2;grid-row:1}
.brw-scan[data-source-side="right"]>.brw-transfer svg{transform:rotate(180deg)}
.brw-search[data-source-side="right"]{grid-template-columns:1fr 620px}
.brw-voice[data-source-side="right"]{grid-template-columns:1fr 520px}
.brw-search[data-source-side="right"]>.brw-excerpt{border-left:0;border-right:3px solid #81c9b0;padding:8px 32px 8px 0}
.brw-scan[data-result-layout="cards"] .brw-result{padding:0;border:0;box-shadow:none;background:transparent;min-height:0}
.brw-scan[data-result-layout="cards"] .brw-field{background:white;border:1px solid #dce4ee;border-left:3px solid #81c9b0;padding:17px 22px;box-shadow:0 8px 18px #20365508}
.brw-voice[data-result-layout="cards"] .brw-transcript-line{display:block;border:1px solid #dce4ee;border-radius:10px;padding:14px 20px;margin-top:12px;background:#f7faff;box-shadow:0 5px 16px #20365505}
.brw-voice[data-result-layout="cards"] .brw-transcript-line>span{display:block;padding:0;margin-bottom:5px}
.brw-voice[data-result-layout="cards"] .brw-transcript-line p{font-size:20px;line-height:1.55}
`;
