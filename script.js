
(() => {
  'use strict';

  const CONFIG = {
    typing: {
      words: ['IT Student', 'Junior Developer', 'Automation Enthusiast', 'Backend Tinkerer'],
      typeSpeed: 75,
      deleteSpeed: 38,
      holdFull: 1800,
      holdEmpty: 420
    },
    reveal: {
      selectors: ['section h2', 'section > p', '.hero-content > *', '.skill-item', '.project-card', '.social-links', '.tech-tags'],
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px',
      stagger: 90,
      maxStagger: 6
    },
    tilt: {
      max: 7,
      scale: 1.015,
      perspective: 900
    },
    cursor: {
      ease: 0.16,
      size: 26,
      grow: 2.6
    },
    navbar: {
      scrolledAt: 24
    }
  };

  // Lenis Smooth Scroll Kurulumu
const lenis = new Lenis({
  duration: 1.8, 
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // 
  smoothWheel: true, //
});

function copyEmail(email) {
    navigator.clipboard.writeText(email);
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

const DISCORD_ID = "832561555945685023";

async function fetchLanyardStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const { data } = await response.json();
        
        if (!data) return;

        // Discord Kullanıcı Adı ve Durum
        document.getElementById('discord-user').innerText = `@${data.discord_user.username}`;
        
        const statusDot = document.getElementById('discord-status-dot');
        statusDot.className = `status-${data.discord_status}`;

        // Spotify Durumu
        const spotifyEl = document.getElementById('spotify-activity');
        if (data.listening_to_spotify) {
            spotifyEl.innerHTML = `<i class="fa-brands fa-spotify" style="color: #1db954;"></i> Listening to <b>${data.spotify.song}</b> by ${data.spotify.artist}`;
        } else {
            spotifyEl.innerText = "Not listening to Spotify";
        }
    } catch (err) {
        console.error("Lanyard API error:", err);
    }
}

// Sayfa açıldığında ve her 30 saniyede bir güncelle
fetchLanyardStatus();
setInterval(fetchLanyardStatus, 30000);

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const lerp = (a, b, t) => a + (b - a) * t;

  const Ticker = (() => {
    const tasks = new Set();
    let running = false;

    const frame = () => {
      tasks.forEach((fn) => fn());
      running = tasks.size > 0;
      if (running) requestAnimationFrame(frame);
    };

    return {
      add(fn) {
        tasks.add(fn);
        if (!running) {
          running = true;
          requestAnimationFrame(frame);
        }
      },
      remove(fn) {
        tasks.delete(fn);
      }
    };
  })();

document.querySelector('#projects').scrollIntoView({
    behavior: 'smooth'

});
  const injectStyles = () => {
    const css = `
      .js-reveal {
        opacity: 0;
        transform: translateY(26px);
        filter: blur(6px);
        transition:
          opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.75s cubic-bezier(0.16, 1, 0.3, 1),
          filter 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        transition-delay: var(--reveal-delay, 0ms);
        will-change: opacity, transform;
      }
      .js-reveal.active {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0);
      }
      .js-reveal.active { will-change: auto; }

      header.scrolled {
        background: rgba(9, 13, 22, 0.78);
        backdrop-filter: blur(22px) saturate(180%);
        -webkit-backdrop-filter: blur(22px) saturate(180%);
        border-bottom-color: rgba(255, 255, 255, 0.12);
        box-shadow: 0 10px 34px -22px rgba(2, 6, 23, 0.95);
      }
      header.scrolled nav { height: 62px; }
      header nav { transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

      .nav-links a.active { color: var(--text-primary); }
      .nav-links a.active::after { width: 40%; }

      .tilt-card {
        transform-style: preserve-3d;
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .tilt-card.is-tilting { transition: transform 0.08s linear; }
      .tilt-card > * { transform: translateZ(22px); }

      .tilt-glow {
        position: absolute;
        inset: 0;
        z-index: 0;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        background: radial-gradient(
          200px circle at var(--glow-x, 50%) var(--glow-y, 50%),
          rgba(168, 85, 247, 0.16),
          rgba(99, 102, 241, 0.08) 42%,
          transparent 68%
        );
      }
      .tilt-card:hover .tilt-glow { opacity: 1; }

      .type-caret {
        display: inline-block;
        width: 2px;
        height: 1em;
        margin-left: 2px;
        vertical-align: -0.12em;
        border-radius: 2px;
        background: linear-gradient(180deg, var(--accent-1, #6366f1), var(--accent-2, #a855f7));
        animation: caret-blink 1.05s steps(1, end) infinite;
      }
      @keyframes caret-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

      .aura-cursor {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        width: ${CONFIG.cursor.size}px;
        height: ${CONFIG.cursor.size}px;
        margin: ${-CONFIG.cursor.size / 2}px 0 0 ${-CONFIG.cursor.size / 2}px;
        border-radius: 50%;
        pointer-events: none;
        opacity: 0;
        mix-blend-mode: screen;
        background: radial-gradient(circle, rgba(129, 140, 248, 0.55), rgba(168, 85, 247, 0.22) 48%, transparent 72%);
        filter: blur(2px);
        transition: opacity 0.35s ease;
        will-change: transform;
      }
      .aura-cursor.visible { opacity: 1; }

      @media (prefers-reduced-motion: reduce) {
        .js-reveal { opacity: 1; transform: none; filter: none; transition: none; }
        .aura-cursor { display: none; }
      }
    `;
    const style = document.createElement('style');
    style.setAttribute('data-source', 'script.js');
    style.textContent = css;
    document.head.appendChild(style);
  };

  const initScrollReveal = () => {
    const targets = [];
    const seen = new Set();

    CONFIG.reveal.selectors.forEach((sel) => {
      $$(sel).forEach((el) => {
        if (seen.has(el)) return;
        if (el.closest('footer')) return;
        seen.add(el);
        targets.push(el);
      });
    });

    if (!targets.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('js-reveal', 'active'));
      return;
    }

    targets.forEach((el) => el.classList.add('js-reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);

        visible.forEach((entry, index) => {
          const el = entry.target;
          const step = Math.min(index, CONFIG.reveal.maxStagger);
          el.style.setProperty('--reveal-delay', `${step * CONFIG.reveal.stagger}ms`);
          el.classList.add('active');
          observer.unobserve(el);
        });
      },
      {
        threshold: CONFIG.reveal.threshold,
        rootMargin: CONFIG.reveal.rootMargin
      }
    );

    targets.forEach((el) => observer.observe(el));
  };

const scrambleElement = document.getElementById('scramble-text');
const targetText = "TQUESS";
const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function runTextScramble() {
    let iteration = 0;
    
    // Var olan zamanlayıcıyı sıfırla
    clearInterval(scrambleElement.scrambleInterval);

    scrambleElement.scrambleInterval = setInterval(() => {
        scrambleElement.innerText = targetText
            .split("")
            .map((char, index) => {
                if (index < iteration) {
                    return targetText[index]; // Çözülen harfleri sabit tut
                }
                return chars[Math.floor(Math.random() * chars.length)]; // Diğerlerine rastgele sembol at
            })
            .join("");

        if (iteration >= targetText.length) {
            clearInterval(scrambleElement.scrambleInterval);
        }

        iteration += 1 / 3; // Çözülme hızı (küçüldükçe harfler daha yavaş netleşir)
    }, 40);
}

// Sayfa ilk açıldığında animasyonu başlat
runTextScramble();

// Her 5 saniyede bir (5000 ms) animasyonu döngüsel olarak tekrar et
setInterval(runTextScramble, 6000);

  const initTilt = () => {
    if (prefersReducedMotion || !isFinePointer) return;

    const cards = $$('.project-card, .skill-item');
    if (!cards.length) return;

    cards.forEach((card) => {
      card.classList.add('tilt-card');
      if (getComputedStyle(card).position === 'static') card.style.position = 'relative';

      const glow = document.createElement('span');
      glow.className = 'tilt-glow';
      card.prepend(glow);

      let frameQueued = false;
      let pointer = { x: 0, y: 0 };
      let rect = null;

      const render = () => {
        frameQueued = false;
        if (!rect) return;

        const px = clamp((pointer.x - rect.left) / rect.width, 0, 1);
        const py = clamp((pointer.y - rect.top) / rect.height, 0, 1);

        const rotateY = (px - 0.5) * 2 * CONFIG.tilt.max;
        const rotateX = (0.5 - py) * 2 * CONFIG.tilt.max;

        card.style.transform =
          `perspective(${CONFIG.tilt.perspective}px) ` +
          `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) ` +
          `translateY(-8px) scale(${CONFIG.tilt.scale})`;

        glow.style.setProperty('--glow-x', `${(px * 100).toFixed(1)}%`);
        glow.style.setProperty('--glow-y', `${(py * 100).toFixed(1)}%`);
      };

      const onEnter = () => {
        rect = card.getBoundingClientRect();
        card.classList.add('is-tilting');
      };

      const onMove = (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        if (!frameQueued) {
          frameQueued = true;
          requestAnimationFrame(render);
        }
      };

      const onLeave = () => {
        card.classList.remove('is-tilting');
        card.style.transform = '';
        glow.style.removeProperty('--glow-x');
        glow.style.removeProperty('--glow-y');
        rect = null;
      };

      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointermove', onMove, { passive: true });
      card.addEventListener('pointerleave', onLeave);
      card.addEventListener('blur', onLeave, true);
    });
  };

  const initNavbar = () => {
    const header = $('header');
    const links = $$('.nav-links a[href^="#"]');
    if (!header) return;

    let scrollQueued = false;
    const onScroll = () => {
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > CONFIG.navbar.scrolledAt);
        scrollQueued = false;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

  
    if (!links.length || !('IntersectionObserver' in window)) return;

    const map = new Map();
    links.forEach((link) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const section = document.querySelector(id);
      if (section) map.set(section, link);
    });

    if (!map.size) return;

    const setActive = (link) => {
      links.forEach((l) => l.classList.toggle('active', l === link));
    };

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(map.get(entry.target));
        });
      },
      {
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0
      }
    );

    map.forEach((_link, section) => spy.observe(section));

    const hero = $('#hero');
    if (hero) {
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.6) setActive(null);
          });
        },
        { threshold: [0, 0.6, 1] }
      ).observe(hero);
    }
  };

  const initTyping = () => {
    const target = $('.hero-content > p');
    if (!target) return;

    const { words, typeSpeed, deleteSpeed, holdFull, holdEmpty } = CONFIG.typing;

    if (prefersReducedMotion) {
      target.textContent = words[0];
      return;
    }

    target.textContent = '';
    target.setAttribute('aria-label', words.join(', '));

    const text = document.createElement('span');
    text.setAttribute('aria-hidden', 'true');

    const caret = document.createElement('span');
    caret.className = 'type-caret';
    caret.setAttribute('aria-hidden', 'true');

    target.append(text, caret);

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer = null;

    const tick = () => {
      const word = words[wordIndex];

      charIndex += deleting ? -1 : 1;
      text.textContent = word.slice(0, charIndex);

      let delay = deleting ? deleteSpeed : typeSpeed;

      if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = holdFull;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = holdEmpty;
      } else if (!deleting) {
        delay += Math.random() * 45;
      }

      timer = setTimeout(tick, delay);
    };

    const start = () => {
      if (!timer) timer = setTimeout(tick, 650);
    };
    const stop = () => {
      clearTimeout(timer);
      timer = null;
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    start();
  };

  const initCursor = () => {
    if (prefersReducedMotion || !isFinePointer) return;

    const aura = document.createElement('div');
    aura.className = 'aura-cursor';
    aura.setAttribute('aria-hidden', 'true');
    document.body.appendChild(aura);

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: mouse.x, y: mouse.y };
    let scale = 1;
    let targetScale = 1;
    let visible = false;

    const interactive = 'a, button, .btn, .project-card, .skill-item, .social-links a, .tech-tags span';

    const render = () => {
      pos.x = lerp(pos.x, mouse.x, CONFIG.cursor.ease);
      pos.y = lerp(pos.y, mouse.y, CONFIG.cursor.ease);
      scale = lerp(scale, targetScale, 0.12);

      aura.style.transform =
        `translate3d(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
    };

    Ticker.add(render);

    window.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'mouse') return;
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        if (!visible) {
          visible = true;
          pos.x = mouse.x;
          pos.y = mouse.y;
          aura.classList.add('visible');
        }

        targetScale = e.target.closest(interactive) ? CONFIG.cursor.grow : 1;
      },
      { passive: true }
    );

    document.addEventListener('pointerdown', () => {
      targetScale *= 0.75;
    });
    document.addEventListener('pointerup', () => {
      targetScale = targetScale < 1 ? 1 : targetScale;
    });

    document.addEventListener('mouseleave', () => {
      visible = false;
      aura.classList.remove('visible');
    });
    document.addEventListener('mouseenter', () => {
      visible = true;
      aura.classList.add('visible');
    });
  };

  const initSmoothScroll = () => {
    const header = $('header');

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      const offset = header ? header.offsetHeight + 16 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });

      history.pushState(null, '', hash);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  };

  const initFooterYear = () => {
    const footerText = $('footer p');
    if (!footerText) return;
    footerText.innerHTML = footerText.innerHTML.replace(/\b20\d{2}\b/, new Date().getFullYear());
  };

  const init = () => {
    injectStyles();
    initScrollReveal();
    initTilt();
    initNavbar();
    initTyping();
    initCursor();
    initSmoothScroll();
    initFooterYear();
    document.body.classList.add('js-ready');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
  
})();
