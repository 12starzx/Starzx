/* ════════════════════════════════════════════════════════════════
   VERDÆ — Globe terrestre 3D interactif (Three.js)
   Sphère atmosphérique + points de restauration + arcs de flux.
   Aucune texture externe : continents évoqués par bruit procédural.
   ════════════════════════════════════════════════════════════════ */
import * as THREE from "three";

const canvas = document.getElementById("globeCanvas");
if (canvas) initGlobe();

function initGlobe(){
  const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  const size = () => ({ w: canvas.clientWidth, h: canvas.clientHeight });
  let { w, h } = size();
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, w/h, 0.1, 100);
  camera.position.set(0, 0, 7.4);

  const group = new THREE.Group();
  scene.add(group);

  const R = 2.2;

  /* — Globe : surface à shader (océan profond + terres claires via fbm) — */
  const earthMat = new THREE.ShaderMaterial({
    uniforms:{
      ocean:{ value:new THREE.Color("#0A2A20") },
      land:{ value:new THREE.Color("#2F7D52") },
      land2:{ value:new THREE.Color("#163A28") },
      glow:{ value:new THREE.Color("#9FE7D2") },
      t:{ value:0 }
    },
    vertexShader:`varying vec3 vN; varying vec3 vP; varying vec3 vView;
      void main(){ vN=normalize(normalMatrix*normal); vP=position;
        vec4 mv=modelViewMatrix*vec4(position,1.0); vView=normalize(-mv.xyz);
        gl_Position=projectionMatrix*mv; }`,
    fragmentShader:`
      varying vec3 vN; varying vec3 vP; varying vec3 vView;
      uniform vec3 ocean; uniform vec3 land; uniform vec3 land2; uniform vec3 glow; uniform float t;
      float hash(vec3 p){ return fract(sin(dot(p,vec3(27.1,61.7,12.4)))*43758.5); }
      float noise(vec3 p){ vec3 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
        float n=mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                    mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
        return n; }
      float fbm(vec3 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5;} return v; }
      void main(){
        float c = fbm(vP*1.6);
        float landMask = smoothstep(0.52,0.62,c);
        vec3 col = mix(ocean, mix(land2,land,smoothstep(0.55,0.8,c)), landMask);
        // léger relief
        col *= 0.8 + 0.4*fbm(vP*5.0);
        // atmosphère / fresnel
        float fres = pow(1.0 - max(dot(vN,vView),0.0), 3.0);
        col += glow * fres * 0.8;
        gl_FragColor = vec4(col, 1.0);
      }`
  });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 96), earthMat);
  group.add(earth);

  /* — Halo atmosphérique externe — */
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(R*1.18, 64, 64),
    new THREE.ShaderMaterial({
      side:THREE.BackSide, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false,
      uniforms:{ c:{ value:new THREE.Color("#9FE7D2") } },
      vertexShader:`varying vec3 vN; varying vec3 vView; void main(){ vN=normalize(normalMatrix*normal);
        vec4 mv=modelViewMatrix*vec4(position,1.0); vView=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
      fragmentShader:`varying vec3 vN; varying vec3 vView; uniform vec3 c;
        void main(){ float f=pow(1.0-max(dot(vN,vView),0.0),3.2); gl_FragColor=vec4(c, f*0.6); }`
    })
  );
  group.add(halo);

  /* — Latitudes/longitudes discrètes — */
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(R*1.002, 24, 16)),
    new THREE.LineBasicMaterial({ color:0x9FE7D2, transparent:true, opacity:0.06 })
  );
  group.add(wire);

  /* — Points de restauration (lat/lon -> sphère) — */
  const sites = [
    [46,9,"green"],[60,10,"green"],[37,-4,"gold"],[43,11,"green"],[66,25,"teal"],
    [38,-28,"green"],[-1,-78,"gold"],[42,1,"green"],[35,138,"teal"],[-33,151,"green"],
    [1,103,"gold"],[-22,-43,"green"],[55,-3,"teal"],[64,-21,"gold"],[27,86,"green"]
  ];
  const colMap = { green:0x2F7D52, gold:0xF0C778, teal:0x9FE7D2 };
  const markers = new THREE.Group(); group.add(markers);
  const pts = [];
  sites.forEach(([lat,lon,kind])=>{
    const p = latLon(lat, lon, R*1.01);
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 12, 12),
      new THREE.MeshBasicMaterial({ color:colMap[kind] })
    );
    m.position.copy(p); markers.add(m); pts.push(p);
    // anneau pulsant
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.05, 0.075, 24),
      new THREE.MeshBasicMaterial({ color:colMap[kind], transparent:true, opacity:0.7, side:THREE.DoubleSide })
    );
    ring.position.copy(p); ring.lookAt(p.clone().multiplyScalar(2));
    ring.userData.phase = Math.random()*6.28; markers.add(ring);
  });

  /* — Arcs de flux entre quelques sites — */
  const arcs = new THREE.Group(); group.add(arcs);
  const links = [[0,8],[2,9],[5,11],[1,4],[6,12],[3,10],[0,5]];
  links.forEach(([a,b])=>{
    const curve = arcCurve(pts[a], pts[b]);
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color:0x9FE7D2, transparent:true, opacity:0.45 }));
    arcs.add(line);
    // particule voyageuse
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.04,8,8), new THREE.MeshBasicMaterial({ color:0xFFF3D6 }));
    dot.userData = { curve, off:Math.random() }; arcs.add(dot);
  });

  /* — Interaction souris (drag rotation) + inertie — */
  let dragging=false, px=0, py=0, vrx=0, vry=0, rx=0.35, ry=0;
  const onDown = e=>{ dragging=true; px=(e.touches?e.touches[0]:e).clientX; py=(e.touches?e.touches[0]:e).clientY; };
  const onUp = ()=> dragging=false;
  const onMove = e=>{
    const cx=(e.touches?e.touches[0]:e).clientX, cy=(e.touches?e.touches[0]:e).clientY;
    if(dragging){ vry=(cx-px)*0.005; vrx=(cy-py)*0.005; ry+=vry; rx+=vrx; px=cx; py=cy; }
  };
  canvas.addEventListener("mousedown", onDown); addEventListener("mouseup", onUp); addEventListener("mousemove", onMove);
  canvas.addEventListener("touchstart", onDown,{passive:true}); addEventListener("touchend", onUp); addEventListener("touchmove", onMove,{passive:true});

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(()=>{
    const t = clock.getElapsedTime();
    earthMat.uniforms.t.value = t;
    if(!dragging){ ry += 0.0016 + vry*0.9; vry*=0.95; vrx*=0.95; rx += vrx; }
    rx = Math.max(-1.1, Math.min(1.1, rx));
    group.rotation.y = ry; group.rotation.x = rx;

    markers.children.forEach(c=>{ if(c.userData.phase!==undefined){
      const s = 1 + Math.sin(t*2 + c.userData.phase)*0.4; c.scale.setScalar(s);
      c.material.opacity = 0.7 - Math.sin(t*2 + c.userData.phase)*0.3;
    }});
    arcs.children.forEach(c=>{ if(c.userData.curve){
      c.userData.off = (c.userData.off + 0.004) % 1;
      c.position.copy(c.userData.curve.getPoint(c.userData.off));
    }});

    if (canvas.clientWidth!==w || canvas.clientHeight!==h){
      w=canvas.clientWidth; h=canvas.clientHeight; renderer.setSize(w,h,false);
      camera.aspect=w/h; camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
  });

  function latLon(lat, lon, r){
    const phi=(90-lat)*Math.PI/180, theta=(lon+180)*Math.PI/180;
    return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta));
  }
  function arcCurve(a, b){
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const lift = 1 + a.distanceTo(b)*0.22;
    mid.normalize().multiplyScalar(R*lift);
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }
}
