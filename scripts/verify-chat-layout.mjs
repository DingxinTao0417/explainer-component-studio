import fs from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer-core';
import {components,css} from '../registry.mjs';
import {baseCSS,helpers} from '../shared.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=resolve(root,'reports/chat-layout');
await fs.mkdir(output,{recursive:true});
const ids=['doubao-chat','doubao-workflow','codex-chat','codex-composer','codex-tool-result','codex-plan','codex-workflow'];
const cases=ids.map(id=>({id,name:id,props:{}}));
const draft='输入内容第一行：可填写具体要求。\n输入内容第二行：可填写补充信息。\n输入内容第三行：可填写输出格式。';
const paragraph='这里是用于检查换行的较长模板内容，可以替换成其他内容。中英文混排 example_component_name，文字应保持清晰的行距。';
const table={title:'表格标题',columns:[{key:'id',label:'编号'},{key:'date',label:'日期'},{key:'state',label:'状态'},{key:'value',label:'数值'}],rows:[{id:'ITEM-01',date:'2026-01-01',state:'状态 A',value:'120'},{id:'ITEM-02',date:'2026-01-02',state:'状态 B',value:'80'}],summary:'结果说明',disclosure:'可替换的表格内容'};
for(const id of ['doubao-chat','doubao-workflow']){
  cases.push({id,name:id+'-draft',props:{composer:{draft,focused:true}}});
  cases.push({id,name:id+'-wide',props:{showSidebar:false,showSummary:false,messages:[{role:'user',text:paragraph},{role:'assistant',heading:'回复标题',paragraphs:[paragraph,paragraph],fields:[{label:'字段名称',value:'可替换的字段内容'}],actions:true}],draft}});
}
cases.push({id:'codex-chat',name:'codex-chat-draft',props:{draft,userMessage:paragraph,reply:paragraph,details:['较长的要点内容：'+paragraph],file:'src/components/example/long_reusable_component_name.tsx'}});
cases.push({id:'codex-composer',name:'codex-composer-draft',props:{draft}});
cases.push({id:'codex-tool-result',name:'codex-tool-result-long-file',props:{file:'src/components/example/long_reusable_component_name_with_extra_details.tsx'}});
cases.push({id:'codex-plan',name:'codex-plan-wrapped',props:{steps:['A','B','C'].map((n,i)=>({state:['done','active','pending'][i],text:`步骤 ${n}：可替换的步骤内容，支持更长的说明文字并自动换行。`}))}});
for(const width of [320,520]) cases.push({id:'codex-workflow',name:`codex-workflow-panel-${width}`,props:{panelWidth:width,panel:{kind:'table',title:'example.csv',table},composer:{draft}}});
cases.push({id:'codex-workflow',name:'codex-workflow-document',props:{showSidebar:false,panel:{kind:'document',title:'example.md',heading:'文档标题',paragraphs:[paragraph],code:'const example = "可替换内容";'},composer:{draft,attachments:[{name:'example.md',detail:'示例附件'}]}}});

const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report=[];
try{
 for(const test of cases){
  const c=components.find(c=>c.id===test.id),p={...structuredClone(c.defaults),...test.props};
  if(c.defaults.composer)p.composer={...c.defaults.composer,...test.props.composer};
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.setViewport({width:c.width,height:c.height,deviceScaleFactor:1});
  await page.setContent(`<style>${baseCSS}${css}#root{width:${c.width}px;height:${c.height}px}</style><div id="root">${c.render(p,helpers('layout-'+test.name))}</div>`);
  await page.evaluate(()=>document.fonts.ready);
  const geometry=await page.evaluate(()=>{
   const problems=[];
   const find=s=>document.querySelector(s), box=e=>e?.getBoundingClientRect();
   const composer=find('.dbchat-composer,.dbw-composer,.cx-composer,.cxw-composer');
   const footer=find('.dbchat-composer-footer,.dbw-composer-footer,.cx-composer-footer,.cxw-composer-footer');
   const editor=find('.dbchat-editor,.dbw-editor,.cx-editor,.cxw-editor');
   const viewport=find('.dbchat-conversation,.dbw-conversation,.cx-conversation-viewport,.cxw-conversation-viewport');
   const cb=box(composer),fb=box(footer),eb=box(editor),vb=box(viewport),rb=box(find('#root'));
   if(cb&&fb){
    if(fb.left<cb.left||fb.right>cb.right||fb.bottom>cb.bottom)problems.push('toolbar outside composer');
    if(eb.bottom>fb.top+1)problems.push('editor overlaps toolbar');
    if(footer.scrollWidth>footer.clientWidth+2)problems.push('toolbar clipped horizontally');
    for(const item of footer.children){const r=box(item);if(r.left<fb.left-1||r.right>fb.right+1)problems.push('toolbar group outside footer');}
    if(cb.bottom>rb.bottom+1)problems.push('composer outside canvas');
    if(vb&&vb.bottom>cb.top+1)problems.push('conversation overlaps composer');
   }
   const actions=find('.cx-tool-actions'),file=find('.cx-file-copy');
   if(actions&&file&&box(file).right>box(actions).left+1)problems.push('filename overlaps actions');
   const fonts={};
   for(const selector of ['.dbchat-message','.dbw-message','.cx-assistant','.cxw-assistant .cxw-message-content']){const el=find(selector);if(el)fonts[selector]=getComputedStyle(el).fontSize;}
   const last=find('.dbchat-messages,.dbw-messages,.cx-conversation,.cxw-conversation');
   return {problems,fonts,composer:cb?{width:cb.width,height:cb.height}:null,conversationOverflow:vb&&last?Math.max(0,box(last).bottom-vb.bottom):0};
  });
  await page.screenshot({path:resolve(output,test.name+'.png')});
  report.push({name:test.name,errors,...geometry});
  await page.close();
 }
} finally {await browser.close();}
await fs.writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2)+'\n');
const failures=report.filter(r=>r.errors.length||r.problems.length);
console.log(JSON.stringify({cases:report.length,failures,report:resolve(output,'report.json')},null,2));
if(failures.length)process.exitCode=1;
