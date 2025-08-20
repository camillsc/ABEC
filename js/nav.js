// js/nav.js
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  if(!btn || !nav) return;

  const toggle = () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : ''; // trava scroll ao abrir
  };

  btn.addEventListener('click', toggle);

  // fecha ao clicar em link ou apertar ESC
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); btn.setAttribute('aria-expanded','false'); document.body.style.overflow='';
  }));
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape' && nav.classList.contains('open')){ toggle(); }
  });
});
