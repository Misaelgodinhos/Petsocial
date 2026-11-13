/* NOVA Design 3.1 — non-destructive image editing */
(()=>{'use strict';
const root=document.getElementById('propertiesBody');if(!root)return;
const fields=[['brightness','Brilho',0,200,100],['contrast','Contraste',0,200,100],['saturation','Saturação',0,200,100],['grayscale','Preto e branco',0,100,0],['sepia','Sépia',0,100,0],['blur','Desfoque',0,20,0],['cornerRadius','Cantos arredondados',0,250,0]];
function render(){
const o=items.find(x=>x.id===selected);
if(o?.type!=='image'||!isEditable(o)||root.querySelector('.nova-image-editor'))return;
const section=document.createElement('section');section.className='nova-image-editor';
section.innerHTML='<h4>Editar imagem</h4><p class="hint">Ajustes não destrutivos. O original permanece salvo.</p><div class="nova-image-presets"></div><div class="nova-image-sliders"></div><button type="button" class="nova-image-reset">Restaurar ajustes</button>';
const presets=section.querySelector('.nova-image-presets');
for(const [name,values] of [['Original',{}],['Vibrante',{contrast:115,saturation:140}],['P&B',{grayscale:100}],['Vintage',{sepia:65,contrast:90,saturation:75}],['Suave',{brightness:108,contrast:92,saturation:90}]]){
const b=document.createElement('button');b.type='button';b.textContent=name;b.onclick=()=>{checkpoint();for(const [key,,,,defaultValue] of fields)o[key]=defaultValue;Object.assign(o,values);changed()};presets.append(b)}
const sliders=section.querySelector('.nova-image-sliders');
for(const [key,name,min,max,defaultValue] of fields){
const label=document.createElement('label');label.className='nova-image-control';
const heading=document.createElement('span'),value=document.createElement('output'),input=document.createElement('input');
heading.textContent=name;input.type='range';input.min=min;input.max=max;input.step=1;input.value=o[key]??defaultValue;value.textContent=input.value;label.append(heading,value,input);sliders.append(label);
let snapshot=false;
input.addEventListener('pointerdown',()=>{checkpoint();snapshot=true});
input.addEventListener('input',()=>{if(!snapshot){checkpoint();snapshot=true}o[key]=Number(input.value);value.textContent=input.value;draw()});
input.addEventListener('change',()=>{snapshot=false;changed()});
}
section.querySelector('.nova-image-reset').onclick=()=>{checkpoint();for(const [key,,,,defaultValue] of fields)o[key]=defaultValue;delete o.crop;changed()};
root.append(section);
}
document.addEventListener('nova:selection',()=>queueMicrotask(render));
const observer=new MutationObserver(()=>queueMicrotask(render));observer.observe(root,{childList:true});queueMicrotask(render);
})();
