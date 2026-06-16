/* ════════════════════════════════════════════════════════════════
   VERDÆ — Scène 3D Hero (Three.js, WebGL)
   Vallée cinématique : ciel dégradé, couches de montagnes low-poly,
   lac à shader, brume volumétrique, pollen lumineux, parallaxe scroll.
   ════════════════════════════════════════════════════════════════ */
import * as THREE from "three";

const canvas = document.getElementById("scene");
let renderer, scene, camera, water, pollen, layers = [], sunMesh;
let scrollY = 0, targetScroll = 0;
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
const clock = new THREE.Clock();
const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;

/* — Palette cohérente avec le design system — */
const COL = {
  skyTop:   new THREE.Color("#0A1F17"),
  skyHorizon:new THREE.Color("#1d4a39"),
  sun:      new THREE.Color("#F0C778"),
  water:    new THREE.Color("#103024"),
  waterHi:  new THREE.Color("#9FE7D2"),
  m1: new THREE.Color("#163A28"),
  m2: new THREE.Color("#0E2A1E"),
  m3: new THREE.Color("#0A2218"),
  m4: new THREE.Color("#071811"),
};

init();

function init(){
  renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, powerPreference:"high-performance" });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2("#0A1F17", 0.018);

  camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 0.1, 300);
  camera.position.set(0, 6, 34);

  buildSky();
  buildSun();
  buildMountains();
  buildWater();
  buildPollen();

  scene.add(new THREE.AmbientLight(0x4a7a5e, 0.7));
  const key = new THREE.DirectionalLight(0xffe9c2, 1.2);
  key.position.set(-18, 20, -10);
  scene.add(key);

  addEventListener("resize", onResize);
  addEventListener("mousemove", e=>{
    mouse.tx = (e.clientX/innerWidth - .5);
    mouse.ty = (e.clientY/innerHeight - .5);
  });
  addEventListener("scroll", ()=>{ targetScroll = scrollY = window.scrollY; });
  document.addEventListener("verdae:scroll", e=>{ targetScroll = e.detail; }, false);

  renderer.setAnimationLoop(render);
}

/* — Ciel : grand dôme à dégradé vertical — */
function buildSky(){
  const geo = new THREE.SphereGeometry(180, 32, 32);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite:false,
    uniforms:{ top:{value:COL.skyTop}, bottom:{value:COL.skyHorizon} },
    vertexShader:`varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
    fragmentShader:`varying vec3 vP; uniform vec3 top; uniform vec3 bottom;
      void main(){ float h=normalize(vP).y*0.5+0.5; vec3 c=mix(bottom,top,smoothstep(0.15,0.85,h));
      gl_FragColor=vec4(c,1.0);} `
  });
  scene.add(new THREE.Mesh(geo, mat));
}

/* — Soleil : disque lumineux halo bas dans la brume — */
function buildSun(){
  const geo = new THREE.CircleGeometry(7, 48);
  const mat = new THREE.ShaderMaterial({
    transparent:true, depthWrite:false,
    uniforms:{ c:{value:COL.sun} },
    vertexShader:`varying vec2 vU; void main(){ vU=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
    fragmentShader:`varying vec2 vU; uniform vec3 c; void main(){ float d=distance(vU,vec2(0.5));
      float a=smoothstep(0.5,0.0,d); float core=smoothstep(0.32,0.0,d);
      gl_FragColor=vec4(c, a*0.5+core*0.5);} `
  });
  sunMesh = new THREE.Mesh(geo, mat);
  sunMesh.position.set(-14, 9, -70);
  scene.add(sunMesh);
}

/* — Montagnes : 4 couches de plans déplacés par bruit, low-poly — */
function buildMountains(){
  const defs = [
    { z:-58, h:30, col:COL.m4, y:-3 },
    { z:-42, h:24, col:COL.m3, y:-4 },
    { z:-26, h:18, col:COL.m2, y:-5 },
    { z:-12, h:13, col:COL.m1, y:-6 },
  ];
  defs.forEach((d, i)=>{
    const geo = new THREE.PlaneGeometry(220, d.h, 90, 12);
    const pos = geo.attributes.position;
    for (let v=0; v<pos.count; v++){
      const x = pos.getX(v), y = pos.getY(v);
      const ridge = ridgeNoise(x*0.05 + i*10, i) * d.h * 0.5;
      const fall = (y/d.h + 0.5); // 0 bas -> 1 haut
      pos.setZ(v, ridge * fall * fall);
    }
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ color:d.col, flatShading:true, roughness:1, metalness:0 });
    const m = new THREE.Mesh(geo, mat);
    m.rotation.x = -Math.PI/2 * 0.04;
    m.position.set(0, d.y, d.z);
    m.userData.baseZ = d.z; m.userData.factor = (i+1)*0.6;
    scene.add(m); layers.push(m);
  });
}

function ridgeNoise(x, seed){
  // somme de sinus pseudo-aléatoires -> crêtes
  let n = 0;
  n += Math.sin(x*1.0 + seed*2.3) * 0.5;
  n += Math.sin(x*2.3 + seed*5.1) * 0.28;
  n += Math.sin(x*4.7 + seed*1.7) * 0.16;
  n += Math.sin(x*9.1 + seed*3.9) * 0.08;
  return Math.abs(n) ;
}

/* — Eau : plan à shader (vagues + fresnel scintillant) — */
function buildWater(){
  const geo = new THREE.PlaneGeometry(400, 400, 120, 120);
  const mat = new THREE.ShaderMaterial({
    transparent:true,
    uniforms:{
      t:{value:0}, base:{value:COL.water}, hi:{value:COL.waterHi}, sun:{value:COL.sun},
      fog:{value:new THREE.Color("#0A1F17")}
    },
    vertexShader:`uniform float t; varying float vH; varying vec2 vU; varying vec3 vW;
      void main(){ vU=uv; vec3 p=position;
        float w = sin(p.x*0.18 + t*1.1)*0.35 + sin(p.y*0.22 - t*0.8)*0.3 + sin((p.x+p.y)*0.4 + t*1.6)*0.12;
        p.z += w; vH=w; vec4 wp=modelMatrix*vec4(p,1.0); vW=wp.xyz;
        gl_Position=projectionMatrix*viewMatrix*wp; }`,
    fragmentShader:`varying float vH; varying vec2 vU; varying vec3 vW;
      uniform vec3 base; uniform vec3 hi; uniform vec3 sun; uniform vec3 fog; uniform float t;
      void main(){
        vec3 col = mix(base, hi, smoothstep(0.1,0.45,vH+0.3)*0.6);
        // reflet solaire vers -z gauche
        float glint = pow(max(0.0, sin(vU.x*40.0 + t*2.0)*0.5+0.5), 8.0);
        float sunBand = smoothstep(0.62,0.40,vU.x) * smoothstep(0.0,0.5,vU.y);
        col += sun * glint * sunBand * 0.5;
        // estompage par distance (brume)
        float d = clamp(length(vW.xz)/200.0, 0.0, 1.0);
        col = mix(col, fog, d*0.9);
        gl_FragColor = vec4(col, 0.92);
      }`
  });
  water = new THREE.Mesh(geo, mat);
  water.rotation.x = -Math.PI/2;
  water.position.y = -6.5;
  scene.add(water);
}

/* — Pollen / lucioles : points lumineux flottants — */
function buildPollen(){
  const N = reduced ? 120 : 420;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N*3);
  const spd = new Float32Array(N);
  for (let i=0;i<N;i++){
    pos[i*3]   = (Math.random()-.5)*120;
    pos[i*3+1] = Math.random()*40 - 4;
    pos[i*3+2] = (Math.random()-.5)*80 - 10;
    spd[i] = Math.random()*0.5 + 0.2;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos,3));
  geo.setAttribute("spd", new THREE.BufferAttribute(spd,1));
  const mat = new THREE.ShaderMaterial({
    transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    uniforms:{ t:{value:0}, c:{value:COL.waterHi} },
    vertexShader:`attribute float spd; uniform float t; varying float vA;
      void main(){ vec3 p=position; p.y += sin(t*spd + position.x)*1.4; p.x += cos(t*spd*0.7)*0.8;
        vA = 0.4 + 0.6*abs(sin(t*spd*1.7 + position.z));
        vec4 mv=modelViewMatrix*vec4(p,1.0); gl_PointSize=(120.0/-mv.z)*spd*2.0; gl_Position=projectionMatrix*mv; }`,
    fragmentShader:`varying float vA; uniform vec3 c; void main(){ float d=distance(gl_PointCoord,vec2(0.5));
      float a=smoothstep(0.5,0.0,d); gl_FragColor=vec4(c, a*vA*0.8); }`
  });
  pollen = new THREE.Points(geo, mat);
  scene.add(pollen);
}

function onResize(){
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
}

function render(){
  const t = clock.getElapsedTime();
  scrollY += (targetScroll - scrollY) * 0.08;
  mouse.x += (mouse.tx - mouse.x) * 0.05;
  mouse.y += (mouse.ty - mouse.y) * 0.05;

  if (water) water.material.uniforms.t.value = t;
  if (pollen) pollen.material.uniforms.t.value = t;

  // parallaxe caméra : descente douce + dérive souris
  const s = scrollY / innerHeight; // pages
  camera.position.y = 6 - s * 3.2 + mouse.y * -2.0;
  camera.position.x = mouse.x * 4.0;
  camera.position.z = 34 + s * 6.0;
  camera.lookAt(0, 2 - s * 1.5, -20);

  // couches montagnes : parallaxe différentielle
  layers.forEach(m=>{ m.position.x = mouse.x * m.userData.factor * -1.4; });
  if (sunMesh){ sunMesh.position.y = 9 - s*2.2; }

  renderer.render(scene, camera);
}
