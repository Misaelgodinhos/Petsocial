/* Touch-friendly layer management. State stays inside the project document. */
(()=>{'use strict';
const label=o=>o.type==='text'?(o.text.trim().split('\n')[0]||'Texto vazio'):o.type==='image'?'Imagem':o.type==='circle'?'Elipse':'Retângulo';
function picked(){return items.filter(o=>multiSelected.has(o.id))}
function expandedSelection(){const chosen=picked(),groups=new Set(chosen.map(o=>o.groupId).filter(Boolean));return items.filter(o=>multiSelected.has(o.id)||(o.groupId&&groups.has(o.groupId)))}
function refresh(){draw();properties();render()}
function mutate(fn){checkpoint();fn();changed();render()}
function button(text,action,disabled=false){const b=document.createElement('button');b.type='button';b.textContent=text;b.disabled=disabled;b.onclick=action;return b}
function render(){const p=$('toolPanel');p.replaceChildren();const heading=document.createElement('h3');heading.textContent='Camadas';p.append(heading);
const hint=document.createElement('p');hint.className='hint';hint.textContent='Marque os itens para agrupar. A primeira camada fica à frente. Bloquear protege também os outros itens do grupo.';p.append(hint);
const controls=document.createElement('div');controls.className='layer-controls';const chosen=expandedSelection();
controls.append(button('Agrupar ('+picked().length+')',()=>{const selection=expandedSelection();if(selection.length<2||selection.some(o=>!isEditable(o)||o.hidden))return;mutate(()=>{const id=uid();selection.forEach(o=>o.groupId=id);selected=selection[0].id;multiSelected.clear()})},chosen.length<2||chosen.some(o=>!isEditable(o)||o.hidden)));
const selectedGroups=new Set([...picked(),items.find(o=>o.id===selected)].filter(Boolean).map(o=>o.groupId).filter(Boolean));
controls.append(button('Desagrupar',()=>mutate(()=>{items.filter(o=>selectedGroups.has(o.groupId)).forEach(o=>delete o.groupId);multiSelected.clear()}),!selectedGroups.size||items.some(o=>selectedGroups.has(o.groupId)&&!isEditable(o))));
controls.append(button('Limpar seleção',()=>{multiSelected.clear();selected=null;refresh()},!selected&&!multiSelected.size));p.append(controls);
if(!items.length){const empty=document.createElement('p');empty.className='hint';empty.textContent='Adicione um texto, uma forma ou uma imagem para começar.';p.append(empty)}
for(const o of [...items].reverse()){
const row=document.createElement('div');row.className='layer-card'+(selected===o.id||multiSelected.has(o.id)?' is-selected':'')+(o.hidden?' is-hidden':'');
const top=document.createElement('div');top.className='layer-card-top';
const check=document.createElement('input');check.type='checkbox';check.checked=multiSelected.has(o.id);check.disabled=o.hidden||!isEditable(o);check.setAttribute('aria-label','Selecionar '+label(o)+' para agrupar');check.onchange=()=>{if(check.checked)multiSelected.add(o.id);else multiSelected.delete(o.id);selected=multiSelected.has(o.id)?o.id:[...multiSelected].at(-1)||null;refresh()};
const name=button(label(o),()=>{selected=o.id;multiSelected.clear();refresh()});name.className='layer-name';name.title=label(o);top.append(check,name);row.append(top);
const info=document.createElement('small');info.textContent=[o.groupId?'Agrupado':'',o.locked?'Bloqueado':!isEditable(o)?'Grupo bloqueado':'',o.hidden?'Oculto':''].filter(Boolean).join(' · ');row.append(info);
const actions=document.createElement('div');actions.className='layer-card-actions';
actions.append(button(o.hidden?'Mostrar':'Ocultar',()=>mutate(()=>{o.hidden=!o.hidden;if(o.hidden){multiSelected.delete(o.id);if(selected===o.id)selected=null}})));
actions.append(button(o.locked?'Desbloquear':'Bloquear',()=>mutate(()=>{o.locked=!o.locked;multiSelected.clear();selected=null})));
const move=step=>{
const members=o.groupId?items.filter(x=>x.groupId===o.groupId):[o];
if(members.some(x=>!isEditable(x)))return;
const moving=new Set(members);
const edge=step>0?Math.max(...members.map(x=>items.indexOf(x))):Math.min(...members.map(x=>items.indexOf(x)));
let neighbor=items[edge+step];
while(neighbor&&moving.has(neighbor)){const i=items.indexOf(neighbor)+step;neighbor=items[i]}
if(!neighbor)return;
const neighborMembers=neighbor.groupId?items.filter(x=>x.groupId===neighbor.groupId):[neighbor];
const adjacent=new Set(neighborMembers);
mutate(()=>{
const original=items.slice();
const blocks=original.filter(x=>moving.has(x));
const neighbors=original.filter(x=>adjacent.has(x));
const remaining=original.filter(x=>!moving.has(x)&&!adjacent.has(x));
const anchor=Math.min(...neighbors.map(x=>original.indexOf(x)));
const before=original.slice(0,anchor).filter(x=>!moving.has(x)&&!adjacent.has(x)).length;
remaining.splice(before,0,...(step>0?[...neighbors,...blocks]:[...blocks,...neighbors]));
items.splice(0,items.length,...remaining);
});
};
const up=button('↑',()=>move(1),(o.groupId?items.filter(x=>x.groupId===o.groupId).some(x=>items.indexOf(x)===items.length-1):items.indexOf(o)===items.length-1)||!isEditable(o));up.setAttribute('aria-label','Subir camada '+label(o));const down=button('↓',()=>move(-1),(o.groupId?items.filter(x=>x.groupId===o.groupId).some(x=>items.indexOf(x)===0):items.indexOf(o)===0)||!isEditable(o));down.setAttribute('aria-label','Descer camada '+label(o));actions.append(up,down);row.append(actions);p.append(row)
}}
window.NovaLayers={render};if(tool==='layers')render();
})();
