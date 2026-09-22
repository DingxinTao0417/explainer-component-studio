import {truck,cargo,warehouse,buffer,resource,bridge,at,text,number,t} from '../transfer-primitives.mjs';
export const css='.ani-transfer-canvas{font-family:ComponentHan,ComponentUI,"Microsoft YaHei",sans-serif;font-weight:750;overflow:hidden}.ani-transfer-canvas text{font-weight:750}';
const definitions=[
 ['truck','运输货车',{load:3,label:'对象名称'},truck,340,235],
 ['cargo','货箱',{label:'',tone:'orange'},cargo,118,120],
 ['warehouse','仓库与站点',{title:'场所名称',open:true,stock:4},warehouse,265,260],
 ['buffer','容量与暂存槽',{title:'区域标题',capacity:6,occupied:3,kinds:['cup','lamp','bag'],state:'normal'},buffer,365,320],
 ['resource','资源物件',{kind:'image',label:'素材名称'},resource,110,140],
 ['relation-bridge','关系括线',{label:'关系标签',direction:'down',width:420},bridge,430,100]
];
export const components=definitions.map(([key,name,base,draw,w,h])=>({id:'ani-atom-'+key,name:'动画风 · '+name,category:'动画风 · 基础组件',description:'原生 SVG 独立部件，可替换内容、状态、位置与等比尺寸。',width:1280,height:720,defaults:{...base,x:360,y:160,objectWidth:540,objectHeight:380},reference:{level:'designed',source:'references/transfer/sources.json',basis:'用户迁移静态状态图；原生几何重建，非截图部件。'},render(props,helpers){const p={...this.defaults,...props},x=number(p.x,0,1270,'x'),y=number(p.y,0,710,'y'),ow=number(p.objectWidth,100,1240,'objectWidth'),oh=number(p.objectHeight,80,690,'objectHeight');if(x+ow>1270||y+oh>710)throw Error('部件超出画布');const width=key==='buffer'?(p.capacity>4?352:244):key==='relation-bridge'?p.width+10:w,height=key==='buffer'?Math.ceil(p.capacity/(p.capacity>4?3:2))*108+100:h,scale=Math.min(ow/width,oh/height);return `<section class="ani-atom-scene"><svg xmlns="http://www.w3.org/2000/svg" class="ani-transfer-canvas" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="${helpers.esc(name)}">${at(x+(ow-width*scale)/2,y+(oh-height*scale)/2,draw(p,helpers),scale)}</svg></section>`;}}));
