/* NOVA Design 3.5 — page sizes and aspect ratios */
(()=>{'use strict';
const canvas=document.getElementById('design'),head=document.querySelector('.workspace-head'),info=document.getElementById('pageInfo'),chip=document.getElementById('pageChip');if(!canvas||!head)return;
const presets=[['Post quadrado',1080,1080],['Post vertical',1080,1350],['Story / Reels',1080,1920],['YouTube',1920,1080],['Capa Facebook',1640,624],['Cartão de visita',1063,591],['Panfleto A5',1748,2480],['Apresentação',1920,1080],['Logo',1024,1024]];
const key='nova-design-format-v1';
const bar=document.createElement('div');bar.className='nova-size-bar';bar.innerHTML='<button type="button" class="nova-size-open" aria-label="Alterar tamanho e proporção do design">▣ Tamanho</button>';
head.append(bar);
const dialog=document.createElement('dialog');dialog.className='nova-size-dialog';dialog.innerHTML='<form method="dialog"><div class="nova-size-title"><h3>Tamanho e proporção</h3><button value="cancel" aria-label="Fechar">✕</button></div><p>Escolha um formato para o seu design.</p><div class="nova-size-presets"></div><div class="nova-size-custom"><label>Largura (px)<input type="number" min="100" max="4096" id="novaSizeW" value="1080"></label><label>Altura (px)<input type="number" min="100" max="4096" id="novaSizeH" value="1080"></label></div><button type="button" class="nova-size-apply">Aplicar tamanho personalizado</button></form>';
document.body.append(dialog);
const list=dialog.querySelector('.nova-size-presets');
function apply(name,w,h){w=Math.round(Number(w));h=Math.round(Number(h));if(!Number.isFinite(w)||!Number.isFinite(h)||w<100||h<100||w>4096||h>4096){alert('Informe dimensões entre 100 e 4096 pixels.');return}
canvas.width=w;canvas.height=h;canvas.style.aspectRatio=w+'/'+h;canvas.style.width='auto';canvas.style.height='auto';if(chip)chip.textContent=name;if(info)info.textContent='Página 1 · '+w+' × '+h+' px';
try{localStorage.setItem(key,JSON.stringify({name,w,h}))}catch(e){}
if(typeof draw==='function')draw();dialog.close();
}
for(const [name,w,h] of presets){const b=document.createElement('button');b.type='button';b.innerHTML='<strong></strong><small></small>';b.querySelector('strong').textContent=name;b.querySelector('small').textContent=w+' × '+h+' px';b.onclick=()=>apply(name,w,h);list.append(b)}
bar.querySelector('button').onclick=()=>{dialog.querySelector('#novaSizeW').value=canvas.width;dialog.querySelector('#novaSizeH').value=canvas.height;dialog.showModal()};
dialog.querySelector('.nova-size-apply').onclick=()=>apply('Personalizado',dialog.querySelector('#novaSizeW').value,dialog.querySelector('#novaSizeH').value);
try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved?.w&&saved?.h)apply(saved.name||'Personalizado',saved.w,saved.h)}catch(e){}
})();
