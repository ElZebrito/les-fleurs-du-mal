(function(){
  gsap.registerPlugin(ScrollTrigger);
  const isTouch = !window.matchMedia('(hover:hover)').matches;

  /* Curseur personnalisé */
  const dot  = document.querySelector('.c-cursor-dot');
  const ring = document.querySelector('.c-cursor-ring');
  if(window.matchMedia('(hover:hover)').matches && dot){
    gsap.set([dot,ring], {xPercent:-50, yPercent:-50});
    window.addEventListener('mousemove', e => {
      gsap.to(dot,  {x:e.clientX, y:e.clientY, duration:.08, overwrite:'auto'});
      gsap.to(ring, {x:e.clientX, y:e.clientY, duration:.5, ease:'power3.out', overwrite:'auto'});
    });
    document.querySelectorAll('a,button,.poem-card').forEach(el => {
      el.addEventListener('mouseenter', () => gsap.to(ring, {scale:2.4, opacity:.6, duration:.3}));
      el.addEventListener('mouseleave', () => gsap.to(ring, {scale:1, opacity:1, duration:.4}));
    });
  }

  /* Entrée nav + hero */
  gsap.from('nav',         {y:-30, opacity:0, duration:.9, ease:'power3.out', onComplete:()=>gsap.set('nav',{clearProps:'transform'})});
  gsap.from('.hero-tag',   {y:35,  opacity:0, duration:.8, delay:.25, ease:'power3.out'});
  gsap.from('.hero-title', {y:65,  opacity:0, duration:1.1, delay:.4,  ease:'power4.out'});
  gsap.from('.hero-info',  {y:22,  opacity:0, duration:.7, delay:.7,  ease:'power3.out'});

  /* Compteurs statistiques */
  document.querySelectorAll('.stat-number').forEach(el => {
    const raw = el.textContent.trim();
    const num = parseInt(raw);
    if(isNaN(num)) return;
    const suffix = raw.replace(/[0-9]/g,'').trim();
    const obj = {val:0};
    ScrollTrigger.create({
      trigger:el, start:'top 80%', once:true,
      onEnter:() => gsap.to(obj,{ val:num, duration:1.8, ease:'power2.out',
        onUpdate:() => { el.textContent = Math.round(obj.val) + suffix; }
      })
    });
  });

  /* Utilitaire ScrollTrigger reveal */
  function sr(sel, fromVars, staggerEach=0){
    gsap.utils.toArray(sel).forEach((el,i) => {
      gsap.from(el,{ ...fromVars, duration:1.05, ease:'power3.out',
        delay:staggerEach*i, scrollTrigger:{trigger:el, start:'top 88%', once:true} });
    });
  }
  sr('.pres-quote',                    {x:-65, opacity:0});
  sr('#presentation > div:last-child', {x:65,  opacity:0});
  sr('.stat',                          {y:40,  opacity:0}, .12);
  sr('.poemes-header',                 {y:30,  opacity:0});
  sr('.poem-card',                     {y:55,  opacity:0}, .14);
  sr('.sections-nav-label',            {y:22,  opacity:0});
  sr('.section-link',                  {y:30,  opacity:0, scale:.95}, .07);

  /* Tilt 3D sur les cartes de poèmes */
  document.querySelectorAll('.poem-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX-r.left)/r.width -.5)*12;
      const y = ((e.clientY-r.top) /r.height-.5)*12;
      gsap.to(card,{rotateY:x, rotateX:-y, duration:.4, ease:'power2.out', transformPerspective:700});
    });
    card.addEventListener('mouseleave',() => {
      gsap.to(card,{rotateX:0, rotateY:0, duration:.8, ease:'elastic.out(1,.5)'});
    });
  });

  /* Hamburger nav */
  var btn=document.querySelector('.nav-toggle'), menu=document.querySelector('.nav-links');
  if(btn){
    btn.addEventListener('click',()=>{btn.classList.toggle('open');menu.classList.toggle('open');});
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{btn.classList.remove('open');menu.classList.remove('open');}));
  }

  /* ── Effets scrub (desktop uniquement) ────────────────── */
  if(!isTouch){

    // Barre de progression de lecture
    const prog = document.createElement('div');
    prog.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:2px;background:var(--accent-gold);z-index:10001;transform-origin:left center;transform:scaleX(0);pointer-events:none;';
    document.body.appendChild(prog);
    gsap.to(prog, { scaleX:1, ease:'none', scrollTrigger:{ trigger:'body', start:'top top', end:'bottom bottom', scrub:true } });

    // Hero — filigrane dérive vers le bas
    gsap.to('.hero-watermark', { y:120, ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:1.5 } });

    // Hero — contenu s'efface en scrollant
    gsap.to('.hero-content', { y:-80, opacity:0, ease:'none', scrollTrigger:{ trigger:'#hero', start:'40% top', end:'bottom top', scrub:1.8 } });

    // Présentation — parallax à vitesses différentes
    gsap.to('.pres-quote', { y:-40, ease:'none', scrollTrigger:{ trigger:'#presentation', start:'top bottom', end:'bottom top', scrub:1.5 } });
    gsap.to('.pres-text',  { y:-20, ease:'none', scrollTrigger:{ trigger:'#presentation', start:'top bottom', end:'bottom top', scrub:2.5 } });

    // Poèmes — profondeur alternée
    gsap.utils.toArray('.poem-card').forEach((card, i) => {
      gsap.to(card, { y:i%2===0 ? -20 : -35, ease:'none', scrollTrigger:{ trigger:'#poemes', start:'top bottom', end:'bottom top', scrub:2 } });
    });

    // Liens de section — scrub en entrée
    gsap.utils.toArray('.section-link').forEach(link => {
      gsap.from(link, { y:30, ease:'none', scrollTrigger:{ trigger:link, start:'top bottom', end:'center 70%', scrub:1.5 } });
    });

    // Nav — transparente en scrollant
    ScrollTrigger.create({
      start:'top -80',
      onUpdate(self){
        document.querySelector('nav').style.background =
          self.direction === -1
            ? 'linear-gradient(to bottom,rgba(0,0,0,.85) 0%,transparent 100%)'
            : 'transparent';
      }
    });

  } // end !isTouch
})();
