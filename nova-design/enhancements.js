/* NOVA Design 1.6: responsividade e navegação de painéis */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const side=$('propertiesPanel'),toggle=$('mobileProperties'),close=$('closeProperties');
const open=()=>{side.classList.add('properties-open');toggle.setAttribute('aria-expanded','true')};
const shut=()=>{side.classList.remove('properties-open');toggle.setAttribute('aria-expanded','false')};
toggle.addEventListener('click',()=>side.classList.contains('properties-open')?shut():open());
close.addEventListener('click',shut);
document.addEventListener('keydown',e=>{if(e.key==='Escape')shut()});
document.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>{if(innerWidth<760)shut()}));
const nav=document.querySelector('nav');nav.setAttribute('aria-label','Ferramentas de edição');
const observer=new MutationObserver(()=>{const active=document.querySelector('nav button.active');if(active)active.setAttribute('aria-current','true');document.querySelectorAll('nav button:not(.active)[aria-current]').forEach(x=>x.removeAttribute('aria-current'))});
observer.observe(nav,{subtree:true,attributes:true,attributeFilter:['class']});
})();
