/* ════════════════════════════════════════════════════════════════
   VERDÆ — Orchestration UI : preloader, curseur, reveals,
   compteurs, contenu dynamique, navigation, tilt, micro-interactions.
   ════════════════════════════════════════════════════════════════ */
import { destinations, experiences, stays, quotes } from "./data.js";

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
const touch = matchMedia("(hover:none)").matches;

/* ─── 1 · INJECTION DU CONTENU ─────────────────────────── */
function buildContent(){
  // Destinations
  $("#destTrack").innerHTML = destinations.map(d=>`
    <article class="dcard" data-tilt style="--grad:${d.grad}">
      <span class="dcard__tag">${d.tag}</span>
      <div class="dcard__name">${d.name}</div>
      <div class="dcard__meta"><span>${d.country}</span><span class="dcard__impact">${d.impact}</span></div>
      <div class="dcard__meta" style="margin-top:6px"><span>${d.price}</span><span>★ 4.9</span></div>
    </article>`).join("");

  // Expériences
  $("#expGrid").innerHTML = experiences.map(e=>`
    <article class="ecard reveal" data-tilt>
      <span class="ecard__ic">${e.ic}</span>
      <h3>${e.name}</h3>
      <p>${e.desc}</p>
      <div class="ecard__bar" style="--w:${e.impact}%"><i></i></div>
      <span class="ecard__lab">${e.lab}</span>
    </article>`).join("");

  // Refuges
  $("#staysList").innerHTML = stays.map((s,i)=>`
    <li data-stay="${i}" data-grad="${s.grad}" class="${i===0?'active':''}">
      <div><h4>${s.name}</h4><small>${s.sub}</small></div>
      <span class="price">${s.price}</span>
    </li>`).join("");
  const visual = $("#stayVisual");
  visual.style.background = stays[0].grad;
  $$("#staysList li").forEach(li=>{
    const set = ()=>{
      $$("#staysList li").forEach(x=>x.classList.remove("active"));
      li.classList.add("active");
      visual.style.background = li.dataset.grad;
    };
    li.addEventListener("mouseenter", set);
    li.addEventListener("click", set);
  });

  // Témoignages
  $("#quotesRail").innerHTML = quotes.map(q=>`
    <article class="qcard">
      <div class="qcard__stars">${q.stars}</div>
      <p>${q.text}</p>
      <div class="qcard__who">
        <span class="qcard__av" style="background:${q.grad}"></span>
        <div><strong>${q.who}</strong><small>${q.role}</small></div>
      </div>
    </article>`).join("");
}

/* ─── 2 · PRELOADER ────────────────────────────────────── */
function preloader(){
  const loader = $("#loader"), fill = $("#loaderFill"), pct = $("#loaderPct");
  let p = 0;
  const tick = setInterval(()=>{
    p += Math.random()*16 + 6;
    if (p >= 100){ p = 100; clearInterval(tick); setTimeout(done, 380); }
    fill.style.width = p + "%";
    pct.textContent = Math.floor(p);
  }, 130);
  function done(){
    loader.classList.add("done");
    document.body.style.overflow = "";
    startReveals();
  }
  document.body.style.overflow = "hidden";
}

/* ─── 3 · CURSEUR PERSONNALISÉ + MAGNÉTIQUE ────────────── */
function cursor(){
  if (touch) return;
  const c = $("#cursor");
  let x = innerWidth/2, y = innerHeight/2, cx = x, cy = y;
  addEventListener("mousemove", e=>{ x = e.clientX; y = e.clientY; });
  (function loop(){
    cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
    c.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  const hot = "a,button,[data-tilt],[data-magnetic],input,li[data-stay]";
  $$(hot).forEach(el=>{
    el.addEventListener("mouseenter", ()=>c.classList.add("hover"));
    el.addEventListener("mouseleave", ()=>c.classList.remove("hover"));
  });

  // boutons magnétiques
  $$("[data-magnetic]").forEach(el=>{
    el.addEventListener("mousemove", e=>{
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width/2;
      const my = e.clientY - r.top - r.height/2;
      el.style.transform = `translate(${mx*0.3}px,${my*0.4}px)`;
    });
    el.addEventListener("mouseleave", ()=> el.style.transform = "");
  });
}

/* ─── 4 · TILT 3D SUR LES CARTES ───────────────────────── */
function tilt(){
  if (touch || reduced) return;
  $$("[data-tilt]").forEach(el=>{
    el.addEventListener("mousemove", e=>{
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - .5;
      const py = (e.clientY - r.top)/r.height - .5;
      el.style.transform = `perspective(900px) rotateY(${px*9}deg) rotateX(${-py*9}deg) translateY(-6px)`;
    });
    el.addEventListener("mouseleave", ()=> el.style.transform = "");
  });
}

/* ─── 5 · REVEAL ON SCROLL ─────────────────────────────── */
let revealsStarted = false;
function startReveals(){
  if (revealsStarted) return; revealsStarted = true;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold:0.18, rootMargin:"0px 0px -8% 0px" });
  $$(".reveal").forEach(el=> io.observe(el));
}

/* ─── 6 · COMPTEURS ANIMÉS ─────────────────────────────── */
function counters(){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || "0");
      const suffix = el.dataset.suffix || "";
      const dur = 1800; const t0 = performance.now();
      (function step(now){
        const k = Math.min((now - t0)/dur, 1);
        const e = 1 - Math.pow(1 - k, 3); // easeOutCubic
        const val = target * e;
        el.textContent = fmt(val, dec) + suffix;
        if (k < 1) requestAnimationFrame(step);
        else el.textContent = fmt(target, dec) + suffix;
      })(t0);
      io.unobserve(el);
    });
  }, { threshold:0.5 });
  $$("[data-count]").forEach(el=> io.observe(el));
}
function fmt(v, dec){
  if (dec > 0) return v.toFixed(dec).replace(".", ",");
  return Math.floor(v).toLocaleString("fr-FR");
}

/* ─── 7 · NAVIGATION ───────────────────────────────────── */
function navigation(){
  const nav = $("#nav"), bar = $("#scrollbar");
  const onScroll = ()=>{
    const y = scrollY;
    nav.classList.toggle("scrolled", y > 40);
    const max = document.body.scrollHeight - innerHeight;
    bar.style.width = (max>0 ? (y/max*100) : 0) + "%";
    // relais vers la scène 3D
    document.dispatchEvent(new CustomEvent("verdae:scroll", { detail: y }));
  };
  addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  // burger mobile
  const burger = $("#burger"), links = $(".nav__links");
  burger?.addEventListener("click", ()=>{
    links.classList.toggle("open");
    burger.classList.toggle("active");
  });
  $$(".nav__links a").forEach(a=> a.addEventListener("click", ()=> links.classList.remove("open")));

  // toggle langue (démo)
  const lang = $("#langBtn");
  lang?.addEventListener("click", ()=> lang.textContent = lang.textContent === "FR" ? "EN" : "FR");
}

/* ─── 8 · CTA + FILM (démo) ────────────────────────────── */
function misc(){
  $("#ctaForm")?.addEventListener("submit", ()=>{
    const btn = $("#ctaForm button");
    btn.innerHTML = "Bienvenue à bord ✓";
    btn.style.background = "linear-gradient(120deg,#F0C778,#9FE7D2)";
  });
  $("#playFilm")?.addEventListener("click", ()=>{
    document.querySelector("#explore").scrollIntoView({ behavior:"smooth" });
  });
}

/* ─── INIT ─────────────────────────────────────────────── */
function boot(){
  buildContent();
  cursor();
  tilt();
  counters();
  navigation();
  misc();
  preloader();
  // filet de sécurité : révéler après 4 s même si preloader bloque
  setTimeout(startReveals, 4000);
}
if (document.readyState === "loading") addEventListener("DOMContentLoaded", boot);
else boot();
