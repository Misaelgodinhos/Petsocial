/* NOVA Design 2.0 — touch multiselect and precision alignment */
(()=>{'use strict';
const bar=document.createElement('div');bar.className='nova-multi-bar';
bar.innerHTML='<button type="button" id="novaMultiToggle" aria-pressed="false">☐ Seleção múltipla</button><span id="novaMultiCount" aria-live="polite">Toque para selecionar vários</span><button type="button" id="novaMultiClear" hidden>Limpar</button>';
document.querySelector('.canvas-wrap').before(bar);
let enabled=false;
const toggle=bar.querySelector('#novaMultiToggle'),count=bar.querySelector('#novaMultiCount'),clear=bar.querySelector('#novaMultiClear');
function refresh(){toggle.setAttribute('aria-pressed',String(enabled));toggle.textContent=enabled?'☑ Concluir seleção':'☐ Seleção múltipla';count.textContent=enabled?multiSelected.size+' selecionado(s)':'Toque para selecionar vários';clear.hidden=!multiSelected.size;draw();properties();if(tool==='layers')panel()}
toggle.onclick=()=>{enabled=!enabled;if(!enabled)multiSelected.clear();refresh()};
clear.onclick=()=>{multiSelected.clear();selected=null;refresh()};
canvas.addEventListener('pointerdown',e=>{
if(!enabled)return;
if(e.button!==0&&e.pointerType==='mouse')return;
e.preventDefault();e.stopImmediatePropagation();
const o=hit(point(e));if(o){if(multiSelected.has(o.id))multiSelected.delete(o.id);else {const group=o.groupId?items.filter(x=>x.groupId===o.groupId&&isEditable(x)&&!x.hidden):[o];group.forEach(x=>multiSelected.add(x.id))}}
selected=[...multiSelected].at(-1)||null;refresh();
},true);
function align(mode){
const chosen=items.filter(x=>multiSelected.has(x.id)&&isEditable(x)&&!x.hidden);
if(chosen.length<2)return;
const minX=Math.min(...chosen.map(x=>x.x)),maxX=Math.max(...chosen.map(x=>x.x+x.w));
const minY=Math.min(...chosen.map(x=>x.y)),maxY=Math.max(...chosen.map(x=>x.y+x.h));
checkpoint();
for(const o of chosen){
if(mode==='left')o.x=minX;
if(mode==='center')o.x=(minX+maxX-o.w)/2;
if(mode==='right')o.x=maxX-o.w;
if(mode==='top')o.y=minY;
if(mode==='middle')o.y=(minY+maxY-o.h)/2;
if(mode==='bottom')o.y=maxY-o.h;
o.x=Math.round(o.x);o.y=Math.round(o.y);
}
changed();refresh();
}
function install(){
const panelEl=document.getElementById('toolPanel');
if(tool!=='layers'||!panelEl||panelEl.querySelector('.nova-align'))return;
const section=document.createElement('div');section.className='nova-align';
section.innerHTML='<h4>Alinhar seleção</h4><p class="hint">Selecione dois ou mais elementos. Alinha pelas bordas do conjunto.</p><div class="nova-align-grid"></div>';
const grid=section.querySelector('.nova-align-grid');
for(const [mode,name] of [['left','Esquerda'],['center','Centro H'],['right','Direita'],['top','Topo'],['middle','Centro V'],['bottom','Base']]){
const b=document.createElement('button');b.type='button';b.textContent=name;b.disabled=multiSelected.size<2;b.onclick=()=>align(mode);grid.append(b);
}
panelEl.append(section);
}
const observer=new MutationObserver(()=>{if(tool==='layers')queueMicrotask(install)});
observer.observe(document.getElementById('toolPanel'),{childList:true});
document.querySelectorAll('[data-tool="layers"]').forEach(b=>b.addEventListener('click',()=>queueMicrotask(install)));
install();
window.NovaMulti={align};
})();
