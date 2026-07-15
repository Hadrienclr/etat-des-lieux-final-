"use strict";

const renderEditorV2=renderEditor;
renderEditor=function(){
  if(step===3&&!current._mobileRoomsPrepared){
    current.rooms.forEach((room,index)=>room.collapsed=index!==0);
    current._mobileRoomsPrepared=true;
  }
  renderEditorV2();
  const stepper=document.querySelector("#stepper");
  stepper.insertAdjacentHTML("afterbegin",`<div class="mobile-step-status"><div><span>Étape ${step+1} sur ${STEPS.length}</span><strong>${STEPS[step]}</strong></div><em>${completion(current)} %</em><div class="mobile-progress"><i style="width:${((step+1)/STEPS.length)*100}%"></i></div></div>`);
  document.querySelector("#prevBtn").setAttribute("aria-label","Étape précédente");
  document.querySelector("#manualSaveBtn").textContent="Enregistrer";
  document.querySelector("#printBtn").classList.toggle("mobile-final-action",step===5);
  document.querySelector("#nextBtn").innerHTML=step===5?"Finaliser":"Continuer <span aria-hidden='true'>→</span>";
};

const renderHomeV2=renderHome;
renderHome=function(){
  renderHomeV2();
  const eyebrow=document.querySelector(".hero .eyebrow"),title=document.querySelector(".hero h1"),copy=document.querySelector(".hero p");
  if(eyebrow)eyebrow.textContent="Dossiers";
  if(title)title.innerHTML="États des lieux";
  if(copy)copy.textContent="Retrouvez un dossier ou commencez une nouvelle intervention.";
};

renderHome();
