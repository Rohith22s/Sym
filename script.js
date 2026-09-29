const canvas = document.getElementById("webgl-bg");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 4.8;

const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth, innerHeight);

const group = new THREE.Group();
scene.add(group);

const geometry = new THREE.BufferGeometry();
const count = 850;
const positions = new Float32Array(count * 3);
for(let i=0;i<count*3;i+=3){
  positions[i] = (Math.random()-.5)*18;
  positions[i+1] = (Math.random()-.5)*11;
  positions[i+2] = (Math.random()-.5)*12;
}
geometry.setAttribute("position", new THREE.BufferAttribute(positions,3));

const material = new THREE.PointsMaterial({
  color:0x00f3ff,
  size:.025,
  transparent:true,
  opacity:.55
});
const stars = new THREE.Points(geometry,material);
group.add(stars);

const grid = new THREE.GridHelper(18,30,0x00f3ff,0x07343c);
grid.rotation.x = Math.PI/2;
grid.position.z = -4;
grid.material.transparent = true;
grid.material.opacity = .12;
scene.add(grid);

let mx=0,my=0;
window.addEventListener("pointermove",e=>{
  mx=(e.clientX/innerWidth-.5)*.6;
  my=(e.clientY/innerHeight-.5)*.4;
});

function animate(){
  requestAnimationFrame(animate);
  stars.rotation.y += .00045;
  stars.rotation.x += .00012;
  group.rotation.y += (mx-group.rotation.y)*.012;
  group.rotation.x += (-my-group.rotation.x)*.012;
  renderer.render(scene,camera);
}
animate();

window.addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});

function openRegisterModal(eventName){
  document.getElementById("registerText").textContent =
    `You are requesting access for ${eventName}. Continue to the official registration portal.`;
  document.getElementById("registerModal").classList.add("open");
  document.body.style.overflow="hidden";
}

function openRulesModal(title,time,venue,rules){
  document.getElementById("rulesTitle").textContent=title;
  document.getElementById("rulesTime").textContent="◷ "+time;
  document.getElementById("rulesVenue").textContent="⌖ "+venue;
  document.getElementById("rulesBody").innerHTML=rules.map(r=>`<li>${r}</li>`).join("");
  document.getElementById("rulesModal").classList.add("open");
  document.body.style.overflow="hidden";
}

function closeModals(){
  document.querySelectorAll(".modal-overlay").forEach(m=>m.classList.remove("open"));
  document.body.style.overflow="";
}

document.querySelectorAll(".modal-overlay").forEach(overlay=>{
  overlay.addEventListener("click",e=>{
    if(e.target===overlay) closeModals();
  });
});

document.addEventListener("keydown",e=>{
  if(e.key==="Escape") closeModals();
});

const counter=document.getElementById("counter");
let n=40;
setInterval(()=>{
  n += Math.random()>.72 ? 1 : 0;
  counter.textContent = String(n).padStart(3,"0")+"+";
},2600);

document.querySelectorAll(".event-card").forEach((card,i)=>{
  card.style.opacity="0";
  card.style.transform="translateY(25px)";
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        setTimeout(()=>{
          card.style.transition="opacity .6s ease, transform .6s ease";
          card.style.opacity="1";
          card.style.transform="translateY(0)";
        },i*90);
        observer.disconnect();
      }
    });
  },{threshold:.12});
  observer.observe(card);
});
