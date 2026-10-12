const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const wa = t => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t)}`;
const dorme = ms => new Promise(r => setTimeout(r, ms));

/* links */
$$("[data-buy]").forEach(a => { a.href = SITE.checkout; a.target = "_blank"; a.rel = "noopener"; });
$$("[data-wa]").forEach(a => { a.href = wa("Olá! Tenho uma dúvida sobre o guia Trabalhos da Escola Sem Word."); a.target = "_blank"; a.rel = "noopener"; });

/* pixel do Meta (opcional) */
if(SITE.pixelMeta){
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', SITE.pixelMeta); fbq('track', 'PageView');
  $$("[data-buy]").forEach(a => a.addEventListener("click", () => fbq('track', 'InitiateCheckout')));
}

/* preço e contagem regressiva (só se configurados) */
$("#preco").innerHTML = SITE.preco ? `${SITE.precoAntigo ? `<s>${SITE.precoAntigo}</s>` : ""}<b>${SITE.preco}</b>` : "";
if(SITE.preco) $("#barra-p").textContent = SITE.preco;
(function(){
  const fim = Date.parse(SITE.fimOferta); if(!fim || fim <= Date.now()) return;
  const padrao = $("#aviso-txt").textContent;
  $("#aviso-txt").textContent = SITE.textoOferta; $("#cont").hidden = false;
  $("#cont2-txt").textContent = SITE.textoOferta; $("#cont2").hidden = false;
  const alvos = [$("#cont"), $("#cont2 b")];
  const p2 = n => String(n).padStart(2, "0");
  const iv = setInterval(tick, 1000); tick();
  function tick(){
    const s = Math.max(0, Math.floor((fim - Date.now())/1000));
    const d = Math.floor(s/86400), h = Math.floor(s%86400/3600), m = Math.floor(s%3600/60), x = s%60;
    const t = (d ? d + "d " : "") + p2(h) + "h " + p2(m) + "m " + p2(x) + "s";
    alvos.forEach(e => e.textContent = t);
    if(s <= 0){ clearInterval(iv); $("#cont").hidden = true; $("#cont2").hidden = true; $("#aviso-txt").textContent = padrao; }
  }
})();

/* depoimentos (só se existirem) */
if(SITE.depoimentos.length){
  $("#depoimentos").hidden = false;
  $("#cartoes").innerHTML = SITE.depoimentos.map(d => `<blockquote>${d.texto}<cite>${d.nome}</cite></blockquote>`).join("");
}

/* faixa */
const docs = ["CV","Carta de candidatura","Requerimento","Email profissional","Relatório","Trabalho escolar","Resumo","Proposta comercial","Orçamento","Plano de negócio","Contrato","Acta","Folha de cálculo","Slides"];
const bloco = docs.map(g => `<span>${g}</span>`).join("");
$("#pista").innerHTML = bloco + bloco;

/* números */
function contar(el){
  const alvo = +el.dataset.n, t0 = performance.now(), dur = 1300;
  if(!alvo){ el.textContent = "0"; return; }
  (function passo(t){ const p = Math.min(1,(t - t0)/dur); el.textContent = Math.round(alvo * (1 - Math.pow(1-p,3))); if(p < 1) requestAnimationFrame(passo); })(t0);
}
const ioN = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ $$("#numeros b").forEach(contar); ioN.disconnect(); } }), {threshold:.4});
ioN.observe($("#numeros"));

/* separadores "para ti" */
const PERFIS = {
  "Sou estudante": {t:"Pára de ficar parado diante de uma folha em branco.", l:["Trabalho escolar ou académico","Resumir um texto longo","Apresentação em slides","Corrigir e melhorar o teu texto"], p:"E o guia lembra: usa a IA para aprender, não só para copiar."},
  "Procuro emprego": {t:"Um CV e uma carta à medida da vaga, sem começares do zero.", l:["CV profissional","Carta de candidatura","Email profissional","Requerimento / carta formal"], p:"Cola o anúncio da vaga na conversa e a carta fica à tua medida."},
  "Sou profissional": {t:"Relatórios, actas e emails sem perderes a tarde toda.", l:["Relatório de actividades","Acta de reunião","Email profissional","Tabela ou folha de cálculo"], p:"Quanto mais números deres, mais forte fica o relatório."},
  "Tenho um negócio": {t:"Propostas e orçamentos que passam profissionalismo ao cliente.", l:["Proposta comercial","Orçamento e factura","Plano de negócio simples","Contrato simples de prestação de serviços"], p:"Com meticais, NUIT e IVA de 16%, como pede o teu dia-a-dia."}
};
function perfil(n){
  const d = PERFIS[n];
  $$("#abas button").forEach(b => b.setAttribute("aria-pressed", b.textContent === n));
  const pn = $("#painel"); pn.style.animation = "none"; void pn.offsetWidth; pn.style.animation = "";
  pn.innerHTML = `<h3>${d.t}</h3><ul>${d.l.map(x => `<li>${x}</li>`).join("")}</ul><p>${d.p}</p><a class="btn" data-buy href="${SITE.checkout}" target="_blank" rel="noopener">Quero o guia agora</a>`;
  if(SITE.pixelMeta && window.fbq) pn.querySelector("[data-buy]").addEventListener("click", () => fbq('track','InitiateCheckout'));
}
$("#abas").innerHTML = Object.keys(PERFIS).map(n => `<button type="button" aria-pressed="false">${n}</button>`).join("");
$("#abas").addEventListener("click", e => { const b = e.target.closest("button"); if(b) perfil(b.textContent); });
perfil("Sou estudante");

/* demonstração no telemóvel */
const chat = $("#chat"), PEDIDO = "Cria um CV profissional de uma página para [PROFISSÃO]. Dados: nome, contacto, formação e experiência. Não inventes informação.";
let corre = false, ciclo = 0;
function bolha(tipo, html){ const d = document.createElement("div"); d.className = "bol " + tipo; d.innerHTML = html; chat.append(d); return d; }
async function demo(id){
  while(corre && id === ciclo){
    chat.innerHTML = "";
    const eu = bolha("eu", "");
    for(const ch of PEDIDO){ if(!corre || id !== ciclo) return; eu.textContent += ch; await dorme(20); }
    await dorme(450); if(!corre || id !== ciclo) return;
    const ia = bolha("ia", '<span class="pontos"><i></i><i></i><i></i></span>');
    await dorme(1200); if(!corre || id !== ciclo) return;
    ia.innerHTML = 'Pronto! Aqui está o teu CV.<div class="doc"><strong>CV profissional</strong><i style="--w:72%;--k:0"></i><i style="--w:90%;--k:1"></i><i style="--w:60%;--k:2"></i><i style="--w:84%;--k:3"></i><i style="--w:50%;--k:4"></i><span class="pdf">Descarregar PDF</span></div>';
    await dorme(5200);
  }
}
new IntersectionObserver(([e]) => { corre = e.isIntersecting; if(corre) demo(++ciclo); }, {threshold:.35}).observe($("#tel"));

/* revelações */
const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add("on"); io.unobserve(e.target); } }), {threshold:.12});
$$(".rv").forEach(el => io.observe(el));

/* inclinação da capa */
const cover = $("#cover"), capa = cover.querySelector(".capa");
if(matchMedia("(hover:hover)").matches){
  addEventListener("mousemove", e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    capa.style.setProperty("--ry", (x * 14) + "deg"); capa.style.setProperty("--rx", (-y * 10) + "deg");
  });
}

/* progresso e barra fixa */
const prog = $("#prog"), barra = $("#barra");
let vistoCTA = true; const zonas = new Set();
new IntersectionObserver(([e]) => { vistoCTA = e.isIntersecting; atualizar(); }).observe($("#hero-acoes"));
const ioZ = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? zonas.add(e.target) : zonas.delete(e.target)); atualizar(); });
["#comprar", ".final"].forEach(s => ioZ.observe($(s)));
function atualizar(){
  const h = document.documentElement.scrollHeight - innerHeight;
  prog.style.width = (h > 0 ? scrollY / h * 100 : 0) + "%";
  barra.classList.toggle("ve", !vistoCTA && zonas.size === 0 && scrollY > 200);
  $(".zap-f").classList.toggle("ve", scrollY > 300 && zonas.size === 0);
}
addEventListener("scroll", atualizar, {passive:true}); atualizar();
