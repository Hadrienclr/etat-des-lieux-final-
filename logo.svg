"use strict";

/* Couche métier V2 : stockage volumineux, filiation entrée/sortie et sauvegarde explicite. */
const V2_DB="constat-edl-storage-v2",V2_STORE="workspace";

function openV2Db(){return new Promise((resolve,reject)=>{const request=indexedDB.open(V2_DB,1);request.onupgradeneeded=()=>request.result.createObjectStore(V2_STORE);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}
async function readV2(){const db=await openV2Db();return new Promise((resolve,reject)=>{const q=db.transaction(V2_STORE).objectStore(V2_STORE).get("records");q.onsuccess=()=>resolve(q.result||null);q.onerror=()=>reject(q.error)})}
async function writeV2(value){const db=await openV2Db();return new Promise((resolve,reject)=>{const tx=db.transaction(V2_STORE,"readwrite");tx.objectStore(V2_STORE).put(structuredClone(value),"records");tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}

persist=async function(){
  try{await writeV2(records);return true}
  catch(error){setSave("Échec de sauvegarde",true);toast("Impossible d’enregistrer. Exportez une sauvegarde avant de continuer.");return false}
};
upsert=async function(){
  if(!current)return true;
  setSave("Enregistrement…",true);current.updatedAt=new Date().toISOString();current.status=deriveStatus(current);
  const index=records.findIndex(record=>record.id===current.id);if(index<0)records.push(current);else records[index]=current;
  const ok=await persist();setSave(ok?"Enregistré":"Non enregistré",!ok);return ok;
};

async function initialiseV2(){
  try{
    const saved=await readV2();
    if(saved?.length)records=saved;
    else if(records.length)await writeV2(records);
    renderHome();
  }catch(error){toast("Le stockage local sécurisé n’est pas disponible.")}
}

function frozenBaseline(source){return{entryId:source.id,reference:source.reference,date:source.date,address:source.address,tenant:source.tenant,rooms:source.rooms.map(room=>({name:room.name,elements:room.elements.map(element=>({name:element.name,condition:element.condition,description:element.description}))}))}}
function createExitFromEntry(source){
  const exit=structuredClone(source);exit.id=uid();exit.type="Sortie";exit.date=localNow();exit.reference="EDS-"+new Date().getFullYear()+"-"+Math.random().toString(36).slice(2,7).toUpperCase();exit.sourceEntryId=source.id;exit.sourceReference=source.reference;exit.baseline=frozenBaseline(source);exit.status="Brouillon";exit.accepted=false;exit.signTenant=exit.signLandlord="";exit.signTenantName=source.tenant;exit.signLandlordName=source.agent||source.landlord;exit.observations="";exit.reserves="";exit.createdAt=exit.updatedAt=new Date().toISOString();
  exit.rooms=source.rooms.map(room=>({id:uid(),name:room.name,validated:false,photos:[],elements:room.elements.map(element=>({id:uid(),name:element.name,entryCondition:element.condition,entryDescription:element.description,condition:"Non vérifié",description:""}))}));
  return exit;
}
duplicate=async function(id,toExit=true){
  const source=records.find(record=>record.id===id);if(!source)return;
  const copy=toExit&&source.type==="Entrée"?createExitFromEntry(source):structuredClone(source);
  if(!(toExit&&source.type==="Entrée")){copy.id=uid();copy.reference="EDL-"+new Date().getFullYear()+"-"+Math.random().toString(36).slice(2,7).toUpperCase();copy.status="Brouillon";copy.accepted=false;copy.signTenant=copy.signLandlord="";copy.createdAt=copy.updatedAt=new Date().toISOString()}
  records.push(copy);await persist();current=copy;step=0;renderEditor();showView("editorView");toast(toExit?"Sortie liée à l’entrée créée":"Copie créée");
};

function showExitChooser(){
  const entries=records.filter(record=>record.type==="Entrée"&&record.rooms?.length).sort((a,b)=>b.date.localeCompare(a.date));
  let modal=document.querySelector("#exitChooser");if(!modal){modal=document.createElement("div");modal.id="exitChooser";modal.className="modal";document.body.appendChild(modal)}
  modal.innerHTML=`<div class="modal-card"><div class="modal-head"><div><div class="eyebrow">Comparaison fiable</div><h2>Créer l’état des lieux de sortie</h2><p class="muted">Choisissez l’entrée qui servira de référence immuable.</p></div><button class="icon-btn" data-exit-close>×</button></div><div class="source-list">${entries.map(entry=>`<button class="source-card" data-source-entry="${entry.id}"><strong>${esc(entry.address||"Adresse non renseignée")}</strong><span>${esc(entry.reference)} · ${new Date(entry.date).toLocaleDateString("fr-FR")} · ${esc(entry.tenant||"Sans locataire")}</span></button>`).join("")||`<div class="section-note">Aucun état des lieux d’entrée disponible. Créez d’abord l’entrée pour bénéficier de la comparaison.</div>`}</div><button class="btn ghost" data-blank-exit style="width:100%;margin-top:12px">Créer exceptionnellement une sortie sans entrée</button></div>`;
  modal.classList.add("open");modal.querySelector("[data-exit-close]").onclick=()=>modal.classList.remove("open");modal.querySelectorAll("[data-source-entry]").forEach(button=>button.onclick=()=>{modal.classList.remove("open");duplicate(button.dataset.sourceEntry,true)});modal.querySelector("[data-blank-exit]").onclick=()=>{modal.classList.remove("open");newRecord("Sortie")};
}

roomHTML=function(room,index){
  const remaining=room.elements.filter(element=>element.condition==="Non vérifié").length;
  const rows=room.elements.map(element=>{
    const changed=current.type==="Sortie"&&element.condition!=="Non vérifié"&&element.condition!==element.entryCondition;
    return `<div class="element compare-element"><div class="element-name"><input data-element-name="${room.id}:${element.id}" value="${esc(element.name)}">${current.type==='Sortie'?`<div class="entry-memory"><span>Entrée</span><strong>${esc(element.entryCondition||"Non documenté")}</strong>${element.entryDescription?`<small>${esc(element.entryDescription)}</small>`:""}</div>`:""}</div><select class="${element.condition.includes('bon')||element.condition==='Bon état'||element.condition==='Neuf'?'state-good':element.condition.includes('Mauvais')||element.condition==='À remplacer'?'state-bad':''}" data-element-condition="${room.id}:${element.id}">${CONDITIONS.map(condition=>`<option value="${esc(condition)}" ${condition===element.condition?'selected':''}>${esc(condition)}</option>`).join("")}</select><input data-k="description" data-element-description="${room.id}:${element.id}" value="${esc(element.description)}" placeholder="Défaut précis, emplacement, dimension"><div class="change-state ${changed?'changed':''}">${current.type==='Sortie'?(changed?'Évolution':'='):'•'}</div></div>`;
  }).join("");
  return `<article class="room ${room.validated?'validated':''}"><div class="room-head"><div class="room-number">${index+1}</div><div class="room-name">${esc(room.name)}</div><div class="room-summary">${room.validated?'✓ Validée':remaining+' à vérifier'} · ${room.photos.length} photo(s)</div><button class="icon-btn no-print" data-room-toggle="${room.id}">⌄</button></div><div class="room-body" ${room.collapsed?'style="display:none"':''}><div class="quick-bar"><button class="btn secondary small" data-all-good="${room.id}">✓ Tout bon état</button><button class="btn ghost small" data-add-element="${room.id}">＋ Élément</button><button class="btn ghost small" data-copy-room="${room.id}">Copier</button><button class="btn danger small" data-delete-room="${room.id}">Supprimer</button></div>${current.type==='Sortie'?`<div class="comparison-banner"><strong>Référence d’entrée figée</strong><span>${esc(current.sourceReference||"Sortie sans entrée liée")}</span></div>`:""}<div class="element-head"><span>Élément / référence</span><span>État ${current.type.toLowerCase()}</span><span>Description factuelle</span><span></span></div>${rows}<div class="photos">${room.photos.map((photo,i)=>`<div class="photo"><img src="${photo.data}" alt="Photo"><button data-delete-photo="${room.id}:${i}">×</button><input data-photo-caption="${room.id}:${i}" value="${esc(photo.caption)}" placeholder="Légende obligatoire"></div>`).join("")}<label class="upload">＋ Ajouter des photos<input type="file" accept="image/*" capture="environment" multiple data-photo="${room.id}"></label></div><div class="room-validate"><button class="btn ${room.validated?'success':''}" data-validate-room="${room.id}">${room.validated?'✓ Pièce validée':'Valider la pièce'}</button></div></div></article>`;
};

buildPrint=function(){
  const r=current,issues=r.rooms.flatMap(room=>room.elements.filter(e=>e.condition.includes("Mauvais")||e.condition==="À remplacer"||(r.type==="Sortie"&&e.condition!=="Non vérifié"&&e.condition!==e.entryCondition)).map(e=>({room:room.name,...e})));
  const roomSections=r.rooms.map((room,index)=>`<section class="pdf-section"><div class="pdf-room-title"><b>${String(index+1).padStart(2,"0")}</b><div><h2>${esc(room.name)}</h2><span>${room.elements.length} éléments · ${room.photos.length} photographies</span></div></div><table class="print-table premium-table"><thead><tr><th>Élément</th>${r.type==='Sortie'?'<th>Entrée</th>':''}<th>${esc(r.type)}</th><th>Constat détaillé</th></tr></thead><tbody>${room.elements.map(e=>`<tr class="${e.condition.includes('Mauvais')||e.condition==='À remplacer'?'pdf-alert':''}"><td><b>${esc(e.name)}</b></td>${r.type==='Sortie'?`<td>${esc(e.entryCondition||'—')}<small>${esc(e.entryDescription||'')}</small></td>`:''}<td>${esc(e.condition)}</td><td>${esc(e.description||'—')}</td></tr>`).join("")}</tbody></table>${room.photos.length?`<div class="print-photos">${room.photos.map((p,i)=>`<figure><img src="${p.data}"><figcaption>${index+1}.${i+1} — ${esc(p.caption||'Vue générale')}</figcaption></figure>`).join("")}</div>`:""}</section>`).join("");
  $("#printView").innerHTML=`<article class="print-page premium-pdf"><header class="pdf-cover"><img src="./logo.svg"><div class="pdf-cover-copy"><span>CONSTAT CONTRADICTOIRE</span><h1>État des lieux<br>d’${esc(r.type.toLowerCase())}</h1><p>${esc(r.address)}<br>${esc(r.postalCode)} ${esc(r.city)}</p></div><div class="pdf-ref"><b>${esc(r.reference)}</b><span>${new Date(r.date).toLocaleString('fr-FR')}</span></div></header><section class="pdf-summary"><div><span>Bien</span><b>${esc(r.nature)}</b><small>${esc(r.lot||'Sans lot')} · étage ${esc(r.floor||'—')} · meublé ${esc(r.furnished)}</small></div><div><span>Locataire</span><b>${esc(r.tenant)}</b><small>${esc(r.tenant2||'')}</small></div><div><span>Bailleur / mandataire</span><b>${esc(r.landlord)}</b><small>${esc(r.agent||'')}</small></div></section>${r.type==='Sortie'?`<div class="pdf-link">Comparaison établie avec l’entrée <b>${esc(r.sourceReference||'non liée')}</b></div>`:""}<section class="pdf-section"><h2>Synthèse du constat</h2><div class="pdf-kpis"><div><b>${r.rooms.length}</b><span>pièces</span></div><div><b>${r.rooms.reduce((n,x)=>n+x.photos.length,0)}</b><span>photos</span></div><div><b>${issues.length}</b><span>points d’attention</span></div></div></section>${roomSections}<section class="pdf-section"><h2>Relevés, accès et observations</h2><table class="print-table"><tbody>${Object.entries(r.meters).map(([key,value])=>`<tr><th>${esc(key)}</th><td>${esc(value||'Non relevé')}</td></tr>`).join("")}${r.keys.map(key=>`<tr><th>${esc(key.name)}</th><td>${esc(key.count)}</td></tr>`).join("")}</tbody></table><div class="pdf-notes"><p><b>Observations</b><br>${esc(r.observations||'Aucune')}</p><p><b>Réserves</b><br>${esc(r.reserves||'Aucune')}</p></div></section><section class="pdf-section pdf-signature-page"><h2>Acceptation et signatures</h2><p>Le présent état des lieux a été établi contradictoirement. Les parties reconnaissent l’avoir relu, en accepter le contenu et en recevoir un exemplaire.</p><div class="print-signs"><div class="print-sign"><b>Locataire</b><span>${esc(r.signTenantName||r.tenant)}</span><img src="${r.signTenant}"></div><div class="print-sign"><b>Bailleur / mandataire</b><span>${esc(r.signLandlordName||r.landlord)}</span><img src="${r.signLandlord}"></div></div></section><footer class="page-footer">${esc(r.reference)} · Constat · Document généré le ${new Date().toLocaleString('fr-FR')}</footer></article>`;
};

$("#newExit").onclick=showExitChooser;
$("#manualSaveBtn").onclick=async()=>{const ok=await upsert();toast(ok?"Dossier enregistré sur cet appareil":"Échec de l’enregistrement")};
const neutralBuildPrint=buildPrint;
buildPrint=function(){
  neutralBuildPrint();
  const print=document.querySelector("#printView");
  print.querySelectorAll(".pdf-cover > img").forEach(image=>image.remove());
  print.innerHTML=print.innerHTML.replaceAll(" · Constat · "," · ").replaceAll("avec Constat","depuis l’application");
};
initialiseV2();
