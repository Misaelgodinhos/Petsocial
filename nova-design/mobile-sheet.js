/* NOVA Design 2.3 — mobile bottom sheet */
(()=>{'use strict';
const tray=document.querySelector('#editorView aside'),toggle=tray?.querySelector('.mobile-panel-toggle'),panel=document.getElementById('toolPanel');
if(!tray||!toggle||!panel)return;
const mobile=window.matchMedia('(max-width:760px)');
let expanded=false;
function render(){
if(!mobile.matches){tray.classList.remove('nova-sheet-open');return}
tray.classList.toggle('nova-sheet-open',expanded);
tray.classList.toggle('panel-collapsed',!expanded);
toggle.setAttribute('aria-expanded',String(expanded));
const name=document.querySelector('nav button.active small')?.textContent||'Ferramentas';
toggle.textContent=expanded?'⌄ '+name+' · Recolher':'⌃ '+name+' · Abrir ferramentas';
}
toggle.addEventListener('click',()=>{expanded=!tray.classList.contains('panel-collapsed');queueMicrotask(render)});
document.querySelectorAll('nav [data-tool]').forEach(b=>b.addEventListener('click',()=>{expanded=true;queueMicrotask(render)}));
let start=null,swiped=false;
toggle.addEventListener('touchstart',e=>{start=e.touches[0]?.clientY??null;swiped=false},{passive:true});
toggle.addEventListener('touchend',e=>{if(start===null)return;const delta=(e.changedTouches[0]?.clientY??start)-start;start=null;if(Math.abs(delta)>35){swiped=true;expanded=delta<0;render()}},{passive:true});
toggle.addEventListener('click',e=>{if(swiped){swiped=false;e.preventDefault();e.stopImmediatePropagation();queueMicrotask(render)}},true);
mobile.addEventListener('change',()=>{expanded=false;render()});
expanded=false;render();
})();
