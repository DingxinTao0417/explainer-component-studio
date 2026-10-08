export const cnPresets=[
 {id:'correspondence',component:'comparison-matrix',name:'逐项对应',query:'对应关系 字段对应'},
 {id:'quadrant',component:'quadrant-map',name:'四象限',query:'四象限 象限定位'},
 {id:'pictorial',component:'pictorial-ratio',name:'象形比例',query:'象形比例 数量阵列'},
 {id:'attachments',component:'ani-atom-hd-attachment-card',name:'附件状态',query:'附件状态 文件大小'},
 {id:'sources',component:'source-citations',name:'来源引用',query:'来源引用 引用出处'}
].map(p=>({...p,path:`examples/cn-batch1/${p.id}.json`,gallery:`demos/cn-information/index.html?preset=${p.id}`}));
export function createCNPresets(components){
 const output={};
 for(const preset of cnPresets){
  const c=components.find(c=>c.id===preset.component);if(!c)throw Error('Missing component '+preset.component);
  const props=structuredClone(c.defaults);
  if(preset.id==='correspondence')Object.assign(props,{layout:'correspondence',title:'同一套结构，替换本次事实',subtitle:'两边保留相同字段，每行对应一种信息',note:'示例内容，使用时按本期讲稿替换。',columns:[{name:'本次通知',tag:''},{name:'新场景通知',tag:''}],rows:[{criterion:'对象',values:['全体同事','项目负责人']},{criterion:'事项',values:['确认材料','提交进度']},{criterion:'截止',values:['周三 18 点','周五 17 点']}],correspondence:{...props.correspondence,highlightRow:1}});
  if(preset.id==='quadrant')Object.assign(props,{title:'先看两个维度，再安排任务',subtitle:'分类位置由两个维度共同决定',xLabel:'影响范围',yLabel:'时间紧迫度',xLow:'小',xHigh:'大',focus:'top-right',note:'任务分类示例，不代表实际测评结果。',quadrants:[{id:'top-left',label:'尽快处理',detail:'时间紧，但影响范围有限。',at:.5},{id:'top-right',label:'优先行动',detail:'时间紧，而且影响面大。',at:1.4},{id:'bottom-left',label:'集中安排',detail:'合并处理，减少来回切换。',at:2.3},{id:'bottom-right',label:'提前规划',detail:'预留时间，拆出关键节点。',at:3.2}]});
  if(preset.id==='pictorial')Object.assign(props,{title:'处理进度，一眼看清',subtitle:'数量与百分比使用同一份数据',value:3,total:10,columns:5,icon:'file',unit:'份',valueLabel:'已处理',restLabel:'待处理',note:'数据为演示；也支持不足一个单位的部分填充。'});
  if(preset.id==='attachments'){
   const base=structuredClone(props.layers[0]);
   const files=[['材料汇总.pdf','pdf',2097152,[{at:0,status:'idle',progress:0},{at:.6,status:'reading',progress:25},{at:2.3,status:'reading',progress:70},{at:4.6,status:'success',progress:100}]],['会议记录.docx','doc',86016,[{at:0,status:'idle',progress:0},{at:1,status:'reading',progress:40},{at:3.2,status:'success',progress:100}]],['待补充的图片说明与来源清单.xlsx','sheet',364544,[{at:0,status:'idle',progress:0},{at:1.4,status:'reading',progress:30},{at:3.8,status:'error',progress:30}]]];
   props.layers=files.map(([fileName,fileType,fileBytes,states],i)=>({...structuredClone(base),id:'file-'+(i+1),x:84+i*384,y:277,width:344,height:166,props:{...structuredClone(base.props),display:'file',fileName,fileType,fileBytes,states}}));
  }
  if(preset.id==='sources')Object.assign(props,{title:'判断有依据，来源能查到',subtitle:'正文中的编号与右侧材料一一对应',claim:'先明确通知对象，\n再确认具体事项，\n最后补齐截止时间。',claimLabel:'这次要说明的判断',note:'下面是来源占位示例，正式使用时替换为核实过的材料。',sources:[{id:'source-a',title:'会议纪要',locator:'第 2 页 · 行动安排',quote:'先确认负责人和具体事项。',kind:'file',at:.5},{id:'source-b',title:'任务说明',locator:'第 3 节 · 提交要求',quote:'补齐提交时间和材料位置。',kind:'file',at:1.7},{id:'source-c',title:'背景材料',locator:'相关条目',quote:'需要时继续查阅背景信息。',kind:'web',at:2.9}]});
  output[preset.id]={version:5,title:preset.name+' · 可调示例',component:c.id,props,effect:preset.id==='attachments'?'ani-hd-parts':'cn-information-reveal',effectOptions:{},timing:{duration:8},soundEnabled:false,soundGain:0};
 }
 return output;
}
