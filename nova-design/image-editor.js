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

// NOVA Design 3.2 — advanced framing, before/after, border and shadow.
const advanced=document.createElement('div');advanced.className='nova-image-advanced';
advanced.innerHTML='<h4>Recorte e acabamento</h4><p class="hint">Use as bordas em porcentagem para ajustar o enquadramento.</p><div class="nova-image-crop"></div><div class="nova-image-finishes"></div><button type="button" class="nova-image-compare">Segure para ver o original</button>';
section.append(advanced);
const cropBox=advanced.querySelector('.nova-image-crop');
const cropValues=()=>{const c=o.crop||{x:0,y:0,w:1,h:1};return {left:Math.round(c.x*100),top:Math.round(c.y*100),right:Math.round((1-c.x-c.w)*100),bottom:Math.round((1-c.y-c.h)*100)}};
for(const [key,name] of [['left','Esquerda'],['top','Topo'],['right','Direita'],['bottom','Base']]){
const l=document.createElement('label');l.textContent=name;const input=document.createElement('input');input.type='range';input.min=0;input.max=85;input.step=1;input.value=cropValues()[key];const output=document.createElement('output');output.textContent=input.value+'%';l.append(input,output);cropBox.append(l);
input.addEventListener('change',()=>{const v=cropValues();v[key]=Number(input.value);const horizontal=key==='left'||key==='right',other=horizontal?(key==='left'?'right':'left'):(key==='top'?'bottom':'top');v[key]=Math.min(v[key],95-v[other]);input.value=v[key];output.textContent=v[key]+'%';checkpoint();o.crop={x:v.left/100,y:v.top/100,w:(100-v.left-v.right)/100,h:(100-v.top-v.bottom)/100};changed()});
}
const finish=advanced.querySelector('.nova-image-finishes');
for(const [key,name,min,max,def] of [['borderWidth','Borda',0,50,0],['imageShadow','Sombra',0,60,0]]){
const l=document.createElement('label');l.textContent=name;const input=document.createElement('input');input.type='range';input.min=min;input.max=max;input.value=o[key]??def;const output=document.createElement('output');output.textContent=input.value;l.append(input,output);finish.append(l);
let started=false;input.addEventListener('pointerdown',()=>{checkpoint();started=true});input.addEventListener('input',()=>{if(!started){checkpoint();started=true}o[key]=Number(input.value);output.textContent=input.value;draw()});input.addEventListener('change',()=>{started=false;changed()});
}
for(const [key,name,def] of [['borderColor','Cor da borda','#ffffff'],['imageShadowColor','Cor da sombra','#000000']]){
const l=document.createElement('label');l.textContent=name;const input=document.createElement('input');input.type='color';input.value=o[key]||def;l.append(input);finish.append(l);input.addEventListener('change',()=>{checkpoint();o[key]=input.value;changed()});
}
const compare=advanced.querySelector('.nova-image-compare');let original=null;
function previewOriginal(){if(original)return;original={brightness:o.brightness,contrast:o.contrast,saturation:o.saturation,grayscale:o.grayscale,sepia:o.sepia,blur:o.blur,cornerRadius:o.cornerRadius,crop:o.crop,borderWidth:o.borderWidth,imageShadow:o.imageShadow};Object.assign(o,{brightness:100,contrast:100,saturation:100,grayscale:0,sepia:0,blur:0,cornerRadius:0,crop:null,borderWidth:0,imageShadow:0});draw()}
function restore(){if(!original)return;Object.assign(o,original);original=null;draw()}
compare.addEventListener('pointerdown',e=>{e.preventDefault();compare.setPointerCapture(e.pointerId);previewOriginal()});compare.addEventListener('pointerup',restore);compare.addEventListener('pointercancel',restore);compare.addEventListener('lostpointercapture',restore);

root.append(section);
}
document.addEventListener('nova:selection',()=>queueMicrotask(render));
const observer=new MutationObserver(()=>queueMicrotask(render));observer.observe(root,{childList:true});queueMicrotask(render);
})();
