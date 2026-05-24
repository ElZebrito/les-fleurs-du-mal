  (function(){
    gsap.registerPlugin(ScrollTrigger);

    /* ── Page loader ──────────────────────────────────────────── */
    const loader = document.getElementById('page-loader');
    const bar    = loader && loader.querySelector('.loader-progress');
    if(loader && bar){
      const tl = gsap.timeline({ onComplete: () => { loader.style.display='none'; startAnimations(); } });
      tl.to(bar, { scaleX:1, duration:.7, ease:'power2.inOut' })
        .to(loader, { yPercent:-100, duration:.9, ease:'power4.inOut' }, '+=.12');
    } else {
      startAnimations();
    }

    /* ── Animations principales ───────────────────────────────── */
    function startAnimations(){
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
        document.querySelectorAll('a,button,.section-card').forEach(el => {
          el.addEventListener('mouseenter', () => gsap.to(ring, {scale:2.4, opacity:.6, duration:.3}));
          el.addEventListener('mouseleave', () => gsap.to(ring, {scale:1, opacity:1, duration:.4}));
        });
      }

      /* Nav entrée */
      gsap.from('nav', {y:-30, opacity:0, duration:.9, ease:'power3.out', onComplete:()=>gsap.set('nav',{clearProps:'transform'})});

      /* Hero title — animation simple sans modifier le DOM */
      gsap.from('.hero-title-top',    {y:60, opacity:0, duration:1.2, delay:.15, ease:'power4.out'});
      gsap.from('.hero-title-bottom', {y:60, opacity:0, duration:1.2, delay:.32, ease:'power4.out'});
      gsap.from('.hero-subtitle',     {opacity:0, y:18, duration:.9, delay:.7,  ease:'power3.out'});
      gsap.from('.hero-scroll',       {opacity:0, y:12, duration:.8, delay:1.1, ease:'power3.out'});

      /* Parallax hero — desktop uniquement */
      const heroBg   = document.querySelector('.hero-bg');
      const logoFond = document.querySelector('.hero-logo-fond');
      if(!isTouch && (heroBg || logoFond)){
        let ticking = false;
        window.addEventListener('scroll', () => {
          if(!ticking){
            requestAnimationFrame(() => {
              const y = window.scrollY * .35;
              if(heroBg)   heroBg.style.transform   = `translateY(${y}px)`;
              if(logoFond) logoFond.style.transform  = `translate(-50%, calc(-55% + ${y}px))`;
              ticking = false;
            });
            ticking = true;
          }
        }, {passive:true});
      }

      /* Utilitaire ScrollTrigger reveal */
      function sr(sel, fromVars, staggerEach=0){
        gsap.utils.toArray(sel).forEach((el,i) => {
          gsap.from(el, {
            ...fromVars,
            duration:1.05, ease:'power3.out',
            delay: staggerEach * i,
            scrollTrigger:{ trigger:el, start:'top 88%', once:true }
          });
        });
      }

      sr('.intro-quote',                {x:-65, opacity:0});
      sr('.intro-text',                 {x:65,  opacity:0});
      sr('.sections-header h2',         {y:45,  opacity:0});
      sr('.sections-header p',          {y:30,  opacity:0});
      sr('.line-ornament',              {y:20,  opacity:0});
      sr('.section-card',               {y:55,  opacity:0, scale:.93}, .1);
      sr('#featured > div:first-child', {x:-60, opacity:0});
      sr('.featured-visual',            {x:60,  opacity:0});
      sr('.timeline-header h2',         {x:-50, opacity:0});
      sr('.timeline-header span',       {x:50,  opacity:0});
      sr('.timeline-item',              {y:45,  opacity:0}, .09);
      sr('.footer-brand',               {y:30,  opacity:0});

      /* Tilt 3D sur les cartes de section */
      document.querySelectorAll('.section-card').forEach(card => {
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width  - .5) * 16;
          const y = ((e.clientY - r.top)  / r.height - .5) * 16;
          gsap.to(card, {rotateY:x, rotateX:-y, duration:.4, ease:'power2.out', transformPerspective:900});
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {rotateX:0, rotateY:0, duration:.8, ease:'elastic.out(1,.5)'});
        });
      });

      /* Hamburger nav */
      var btn = document.querySelector('.nav-toggle');
      var menu = document.querySelector('.nav-links');
      if(btn){
        btn.addEventListener('click', () => { btn.classList.toggle('open'); menu.classList.toggle('open'); });
        menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { btn.classList.remove('open'); menu.classList.remove('open'); }));
      }

      /* ── ScrollTrigger scrub (desktop uniquement) ────────── */
      if(!isTouch){

      // Barre de progression de lecture
      const prog = document.createElement('div');
      prog.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:2px;background:var(--accent-gold);z-index:10001;transform-origin:left center;transform:scaleX(0);pointer-events:none;';
      document.body.appendChild(prog);
      gsap.to(prog, {
        scaleX:1, ease:'none',
        scrollTrigger:{ trigger:'body', start:'top top', end:'bottom bottom', scrub:true }
      });

      // Hero — contenu glisse vers le haut et s'efface en scrollant
      gsap.to('.hero-content', {
        y:-90, opacity:0, ease:'none',
        scrollTrigger:{ trigger:'#hero', start:'40% top', end:'bottom top', scrub:1.8 }
      });

      // Intro — quote et texte à des vitesses différentes
      gsap.to('.intro-quote', {
        y:-50, ease:'none',
        scrollTrigger:{ trigger:'#intro', start:'top bottom', end:'bottom top', scrub:1.5 }
      });
      gsap.to('.intro-text', {
        y:-25, ease:'none',
        scrollTrigger:{ trigger:'#intro', start:'top bottom', end:'bottom top', scrub:2.5 }
      });

      // Featured — illustration monte, texte descend légèrement (profondeur)
      gsap.to('.featured-illustration', {
        y:-70, ease:'none',
        scrollTrigger:{ trigger:'#featured', start:'top bottom', end:'bottom top', scrub:1.2 }
      });
      gsap.to('#featured > div:first-child', {
        y:40, ease:'none',
        scrollTrigger:{ trigger:'#featured', start:'top bottom', end:'bottom top', scrub:2.2 }
      });

      // Timeline — les années dérivent légèrement vers la gauche
      gsap.utils.toArray('.timeline-year').forEach(el => {
        gsap.from(el, {
          x:-20, ease:'none',
          scrollTrigger:{ trigger:el, start:'top bottom', end:'center 60%', scrub:1.5 }
        });
      });

      // Nav — devient transparente en descendant, revient opaque en remontant
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
    }
  })();
