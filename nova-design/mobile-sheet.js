/* NOVA Design 3.0 — mobile workspace controller */
(()=>{'use strict';
const editor=document.getElementById('editorView'),tray=editor?.querySelector('aside'),handle=tray?.querySelector('.mobile-panel-toggle'),panel=document.getElementById('toolPanel'),nav=editor?.querySelector('nav');
if(!editor||!tray||!handle||!panel||!nav)return;
const mq=matchMedia('(max-width:760px)');
let open=false,startY=null,gesture=false;
function label(){return nav.querySelector('button.active small')?.textContent?.trim()||'Ferramentas'}
function sync(){
if(!mq.matches){tray.classList.remove('nova-sheet-open','panel-collapsed');return}
tray.classList.toggle('nova-sheet-open',open);
tray.classList.toggle('panel-collapsed',!open);
handle.textContent=open?'⌄  '+label()+' · Fechar':'⌃  '+label()+' · Ferramentas';
handle.setAttribute('aria-expanded',String(open));
handle.setAttribute('aria-label',open?'Recolher painel de '+label():'Expandir painel de '+label());
}
handle.addEventListener('click',e=>{if(!mq.matches)return;e.preventDefault();e.stopImmediatePropagation();if(gesture){gesture=false;return}open=!open;sync()},true);
handle.addEventListener('touchstart',e=>{startY=e.touches[0]?.clientY??null;gesture=false},{passive:true});
handle.addEventListener('touchend',e=>{if(startY===null)return;const d=(e.changedTouches[0]?.clientY??startY)-startY;startY=null;if(Math.abs(d)>35){gesture=true;open=d<0;sync()}},{passive:true});
nav.querySelectorAll('[data-tool]').forEach(button=>button.addEventListener('click',()=>{if(!mq.matches)return;open=true;queueMicrotask(sync);panel.scrollTop=0}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open){open=false;sync()}});
mq.addEventListener('change',()=>{open=false;sync()});
const canvas=editor.querySelector('canvas');canvas?.addEventListener('pointerdown',()=>{if(open){open=false;sync()}},{passive:true});
sync();
})();
