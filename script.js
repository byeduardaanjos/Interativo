const CONFIG = {
  members: ["NOME 1", "NOME 2", "NOME 3", "NOME 4"],
  years: {
    2024: { title: "Tudo ainda parecia distante.", text: "A gente mudou sem perceber. Entre novas rotinas, primeiras escolhas e amizades que começaram a ocupar um lugar enorme." },
    2025: { title: "O meio do caminho virou história.", text: "Vieram mudanças, dias difíceis, risadas inesperadas e a sensação de que estávamos construindo algo que só entenderíamos depois." },
    2026: { title: "De repente, era a última vez.", text: "Último primeiro dia. Últimos intervalos. Últimas provas. O fim chegou com pressa — e fez cada momento parecer mais precioso." }
  },
  words: ["AMIZADES","RISADAS","APRENDIZADOS","SAUDADE","DESCOBERTAS","PROFESSORES","INTERVALOS","CONQUISTAS","MUDANÇAS","SONHOS"],
  capsules: [
    { title: "O que eu vou sentir falta", messages: ["[Resposta real do aluno 1]", "[Resposta real do aluno 2]", "[Resposta real do aluno 3]"] },
    { title: "Uma coisa que nunca vou esquecer", messages: ["[Uma memória marcante da turma]", "[Outra memória que merece ficar guardada]"] },
    { title: "O que o terceirão me ensinou", messages: ["[Aprendizado do aluno 1]", "[Aprendizado do aluno 2]"] },
    { title: "Meu maior sonho para o futuro", messages: ["[Sonho para depois da escola]", "[Outro sonho para 2036]"] },
    { title: "Uma mensagem para a nossa turma", messages: ["[Mensagem final para a turma]", "[Mensagem de outro integrante]"] }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  renderWords(); renderCapsules(); renderMembers(); initTimeline(); initScroll(); initParticles(); initAudio(); initVideo(); initPointer(); initReveal();
});

function renderMembers(){ document.querySelector("#groupMembers").innerHTML = CONFIG.members.join(" · "); }
function renderWords(){
  const field=document.querySelector("#wordField");
  const positions=[[8,15],[47,8],[72,24],[25,33],[56,42],[4,55],[74,58],[31,68],[59,78],[13,86]];
  CONFIG.words.forEach((word,i)=>{const el=document.createElement("span");el.className="floating-word";el.textContent=word;el.style.left=positions[i][0]+"%";el.style.top=positions[i][1]+"%";el.style.transform=`rotate(${(i%3-1)*3}deg)`;el.addEventListener("click",()=>{el.classList.toggle("active")});field.appendChild(el)});
}
function renderCapsules(){
  const list=document.querySelector("#capsuleList");
  CONFIG.capsules.forEach((item,i)=>{const row=document.createElement("div");row.className="capsule-row reveal";row.tabIndex=0;row.role="button";row.innerHTML=`<span class="capsule-num">0${i+1}</span><h3>${item.title}</h3><span class="capsule-open"><i data-lucide="plus"></i></span>`;row.addEventListener("click",()=>openCapsule(i));row.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")openCapsule(i)});list.appendChild(row)});if(window.lucide)lucide.createIcons();
  document.querySelector("#dialogClose").addEventListener("click",()=>document.querySelector("#capsuleDialog").close());
}
function openCapsule(index){const item=CONFIG.capsules[index],dialog=document.querySelector("#capsuleDialog");document.querySelector("#dialogIndex").textContent=`0${index+1}`;document.querySelector("#dialogTitle").textContent=item.title;document.querySelector("#dialogMessages").innerHTML=item.messages.map((m,j)=>`<div class="message"><b>mensagem ${String(j+1).padStart(2,"0")}</b>${m}</div>`).join("");dialog.showModal();}
function initTimeline(){
  const buttons=[...document.querySelectorAll(".year")],copy=document.querySelector(".time-copy");
  function setYear(y){buttons.forEach(b=>b.classList.toggle("active",b.dataset.year===String(y)));document.querySelector("#timeNumber").textContent=y;document.querySelector("#timeTitle").textContent=CONFIG.years[y].title;document.querySelector("#timeText").textContent=CONFIG.years[y].text;copy.classList.remove("swap");void copy.offsetWidth;copy.classList.add("swap")}
  buttons.forEach(b=>b.addEventListener("click",()=>setYear(+b.dataset.year)));
  const section=document.querySelector("#tempo");window.addEventListener("scroll",()=>{const r=section.getBoundingClientRect();const p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));setYear(p<.34?2024:p<.68?2025:2026)},{passive:true});
}
function initScroll(){
  const bar=document.querySelector("#progressBar");window.addEventListener("scroll",()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=`${max?scrollY/max*100:0}%`},{passive:true});
  document.querySelector("#startExperience").addEventListener("click",()=>document.querySelector("#tempo").scrollIntoView({behavior:"smooth"}));
}
function initPointer(){if(matchMedia("(pointer:fine)").matches){window.addEventListener("pointermove",e=>{document.documentElement.style.setProperty("--mx",e.clientX+"px");document.documentElement.style.setProperty("--my",e.clientY+"px")},{passive:true});}}
function initAudio(){
  const audio=document.querySelector("#ambientAudio"),btn=document.querySelector("#soundToggle");let active=false;audio.volume=.28;
  btn.addEventListener("click",async()=>{try{if(active){audio.pause();active=false}else{await audio.play();active=true}btn.innerHTML=active?'<i data-lucide="volume-2"></i><span>som</span>':'<i data-lucide="volume-x"></i><span>som</span>';btn.setAttribute("aria-label",active?"Desativar música ambiente":"Ativar música ambiente");if(window.lucide)lucide.createIcons()}catch{btn.title="Adicione assets/ambient.mp3 para ativar a música"}})
}
function initVideo(){
  const video=document.querySelector("#memoryVideo"),placeholder=document.querySelector("#playMemories");
  placeholder.addEventListener("click",async()=>{try{placeholder.classList.add("hidden");await video.play()}catch{placeholder.classList.remove("hidden");placeholder.querySelector("small").textContent="adicione o arquivo assets/memorias.mp4"}});
  video.addEventListener("play",()=>placeholder.classList.add("hidden"));
  video.addEventListener("error",()=>{placeholder.classList.remove("hidden");placeholder.querySelector("small").textContent="adicione o arquivo assets/memorias.mp4"},{once:true});
}
function initReveal(){const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.13});document.querySelectorAll(".section-kicker,.section-heading,.film-intro,.future-card,.art-statement,.art-explainer,.disciplines,.end-line,.ending h2,.reveal").forEach(el=>{el.style.opacity="0";el.style.transform="translateY(20px)";el.style.transition="opacity .8s ease, transform .8s ease";obs.observe(el)});const style=document.createElement("style");style.textContent=".visible{opacity:1!important;transform:none!important}";document.head.appendChild(style)}
function initParticles(){
  const canvas=document.querySelector("#particles"),ctx=canvas.getContext("2d");let dots=[];function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);dots=Array.from({length:Math.min(42,Math.floor(innerWidth/28))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.1+.2,v:Math.random()*.13+.03,a:Math.random()*.35+.08}))}function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const d of dots){d.y-=d.v;if(d.y<0){d.y=innerHeight;d.x=Math.random()*innerWidth}ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fillStyle=`rgba(220,211,255,${d.a})`;ctx.fill()}requestAnimationFrame(draw)}resize();addEventListener("resize",resize);draw();
}
