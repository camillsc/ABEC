// js/gallery.js

/* ========= CONFIG ========= */
const GALLERY_FILES = [
  "1.JPG","2.JPG","3.JPG","4.JPG","5.JPG","6.JPG","7.JPG", "8.JPG"
];
/* ========================= */

document.addEventListener('DOMContentLoaded', () => {
  console.log('gallery.js carregado'); // sanity check no console
  const lightbox = initLightbox();                  // cria o lightbox e retorna API
  buildGrid((i)=> lightbox.open(i));                // passa callback pra abrir o LB
  initTopCarousel();                                // inicia carrossel do topo
});

/* ---------- Grade de miniaturas ---------- */
function buildGrid(onClickItem){
  const grid = document.getElementById('galleryGrid');
  if(!grid) return;

  const frag = document.createDocumentFragment();
  GALLERY_FILES.forEach((file, i) => {
    const li = document.createElement('li');

    const img = document.createElement('img');
    img.src = `resources/gallery/${file}`;
    img.alt = `Foto ${i+1} — ABEC`;

    const btn = document.createElement('button');
    btn.type = "button";
    btn.setAttribute('aria-label', `Abrir foto ${i+1}`);
    btn.addEventListener('click', ()=> onClickItem(i));

    li.appendChild(img);
    li.appendChild(btn);
    frag.appendChild(li);
  });

  grid.innerHTML = '';
  grid.appendChild(frag);
}

/* ---------- Lightbox com blur ---------- */
function initLightbox(){
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lbImage');
  const caption = document.getElementById('lbCaption');
  const closeBtn = lb.querySelector('.lb__close');
  const prevBtn = lb.querySelector('.lb__prev');
  const nextBtn = lb.querySelector('.lb__next');

  let currentIndex = 0;

  function render(){
    const file = GALLERY_FILES[currentIndex];
    img.src = `resources/gallery/${file}`;
    img.alt = `Foto ${currentIndex+1} — ABEC`;
    caption.textContent = `Foto ${currentIndex+1} de ${GALLERY_FILES.length}`;
  }
  function open(i){
    currentIndex = i;
    render();
    lb.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    lb.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  function go(step){
    currentIndex = (currentIndex + step + GALLERY_FILES.length) % GALLERY_FILES.length;
    render();
  }

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', ()=> go(-1));
  nextBtn.addEventListener('click', ()=> go(1));

  lb.addEventListener('click', (e)=>{
    if(e.target.classList.contains('lightbox__backdrop')) close();
  });

  document.addEventListener('keydown', (e)=>{
    if(lb.getAttribute('aria-hidden') === 'true') return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') go(-1);
    if(e.key === 'ArrowRight') go(1);
  });

  return { open, close, go }; // API usada pela grade
}

/* ---------- Carrossel do topo ---------- */
function initTopCarousel(){
  const root = document.querySelector('.top-carousel');
  if(!root) return;

  const track = root.querySelector('.tc__track');
  const slides = Array.from(root.querySelectorAll('.tc__slide'));
  const prev = root.querySelector('.tc__prev');
  const next = root.querySelector('.tc__next');
  const dotsWrap = root.querySelector('.tc__dots');

  let idx = 0, timer = null;
  const AUTOPLAY = 4500;

  // Dots
  slides.forEach((_, i)=>{
    const d = document.createElement('button');
    d.className = 'tc__dot';
    d.setAttribute('role','tab');
    d.setAttribute('aria-label',`Ir para slide ${i+1}`);
    d.addEventListener('click', ()=> go(i));
    dotsWrap.appendChild(d);
  });

  function update(){
    track.style.transform = `translateX(${-idx*100}%)`;
    [...dotsWrap.children].forEach((d,i)=> d.setAttribute('aria-selected', i===idx ? 'true' : 'false'));
  }
  function go(i){ idx = (i + slides.length) % slides.length; update(); }
  function step(n){ go(idx + n); }

  prev.addEventListener('click', ()=> step(-1));
  next.addEventListener('click', ()=> step(1));

  function start(){ stop(); timer = setInterval(()=> step(1), AUTOPLAY); }
  function stop(){ if(timer) clearInterval(timer); }

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);

  update(); start();
}
