/* NOVA Design 2.4 — contextual editing controls */
(()=>{'use strict';
const editor=document.getElementById('editorView'),canvas=document.getElementById('design');
if(!editor||!canvas)return;
const bar=document.createElement('div');bar.className='nova-context-bar';bar.hidden=true;bar.setAttribute('role','toolbar');bar.setAttribute('aria-label','Ações do elemento selecionado');
bar.innerHTML='<span class="nova-context-type"></span><div class="nova-context-actions"></div>';
editor.querySelector('.canvas-wrap').append(bar);
const label=bar.querySelector('.nova-context-type'),actions=bar.querySelector('.nova-context-actions');
const typeNames={text:'Texto',image:'Imagem',rect:'Forma',circle:'Forma'};
function button(text,fn,title){const b=document.createElement('button');b.type='button';b.textContent=text;b.title=title||text;b.onclick=fn;actions.append(b)}
function mutate(fn){checkpoint();fn();changed();queueMicrotask(update)}
function update(){
const o=items.find(x=>x.id===selected&&!x.hidden),editable=o&&isEditable(o);
bar.hidden=!editable;if(!editable)return;
label.textContent=typeNames[o.type]||'Elemento';actions.replaceChildren();
if(o.type==='text'){
button('−',()=>mutate(()=>o.size=Math.max(8,(Number(o.size)||40)-4)),'Diminuir fonte');
button((o.size||40)+' px',()=>{document.getElementById('mobileProperties')?.click()},'Mais opções de texto');
button('+',()=>mutate(()=>o.size=Math.min(300,(Number(o.size)||40)+4)),'Aumentar fonte');
button('B',()=>mutate(()=>o.bold=!o.bold),'Negrito');
button('Editar',()=>{document.getElementById('mobileProperties')?.click();document.querySelector('[data-prop="text"]')?.focus()},'Editar conteúdo');
}else if(o.type==='image'){
button('−',()=>mutate(()=>o.opacity=Math.max(.1,Math.round(((o.opacity??1)-.1)*10)/10)),'Menos opacidade');
button('＋',()=>mutate(()=>o.opacity=Math.min(1,Math.round(((o.opacity??1)+.1)*10)/10)),'Mais opacidade');
button('Ajustar',()=>document.getElementById('mobileProperties')?.click(),'Editar imagem');
}else{
button('Cor',()=>document.getElementById('mobileProperties')?.click(),'Alterar cor');
button('−',()=>mutate(()=>{o.w=Math.max(20,o.w*.9);o.h=Math.max(20,o.h*.9)}),'Diminuir forma');
button('＋',()=>mutate(()=>{o.w*=1.1;o.h*=1.1}),'Aumentar forma');
}
button('Duplicar',()=>mutate(()=>{const copy=JSON.parse(JSON.stringify(o));copy.id=uid();delete copy.groupId;copy.x+=25;copy.y+=25;items.push(copy);if(copy.type==='image')loadImage(copy);selected=copy.id}),'Duplicar elemento');
button('✕',()=>mutate(()=>{items=items.filter(x=>x.id!==o.id);multiSelected.delete(o.id);selected=null}),'Excluir elemento');
}
document.addEventListener('nova:selection',()=>queueMicrotask(update));
canvas.addEventListener('pointerup',()=>queueMicrotask(update));
document.addEventListener('click',e=>{if(e.target.closest('.layer-card,.nova-multi-bar'))queueMicrotask(update)});
update();
})();
