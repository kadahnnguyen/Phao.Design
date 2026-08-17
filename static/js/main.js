/*
 * Phao Design. Four jobs only: the mobile nav, reveal on scroll, hero cross-fade,
 * and the project-rail scroll fade. No dependencies, no build step, nothing that
 * needs replacing after handover.
 */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mobile navigation ---------- */

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- reveal on entry ---------- */

  const revealables = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('is-revealed'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    revealables.forEach((el) => observer.observe(el));

    // Safety net. If the observer never fires, for instance in a background tab or
    // a browser that throttles it, anything already on screen must not sit at zero
    // opacity. Content staying invisible is a worse failure than losing an effect.
    window.setTimeout(() => {
      for (const el of revealables) {
        if (el.classList.contains('is-revealed')) continue;
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-revealed');
          observer.unobserve(el);
        }
      }
    }, 1500);
  }

  /* The hero is a single still image by design, so there is no third effect here.
     Two remain: reveal on entry, and the card scale on hover. */

  /* ---------- project rail scroll fade ---------- */

  // The rail (title + meta) only scrolls within itself once a long list runs past
  // the viewport (see the max-height rule in main.css). Its own scrollbar is always
  // hidden, so this is the only cue that there's more below — and it only appears
  // when that's actually true, never on a rail short enough to never scroll.
  document.querySelectorAll('.project__rail').forEach((rail) => {
    const update = () => {
      const hasMore = rail.scrollHeight - rail.clientHeight - rail.scrollTop > 1;
      rail.classList.toggle('has-more-below', hasMore);
    };
    rail.addEventListener('scroll', update, { passive: true });

    // Not a plain update() + resize listener: a `defer`red script can run before
    // the browser has settled layout, so the very first clientHeight read is
    // sometimes still the pre-CSS value. ResizeObserver fires once with the real,
    // post-layout size as soon as it starts observing, then again on any later
    // resize (window resize, font swap, orientation change) — one mechanism
    // covers both the initial read and everything after it.
    if ('ResizeObserver' in window) {
      new ResizeObserver(update).observe(rail);
    } else {
      update();
      window.addEventListener('resize', update);
    }

    // Scrolling up anywhere else on the page, once the page itself has bottomed out
    // at the top, carries on into the rail instead of stopping dead. Without this the
    // rail could sit stuck halfway down its own content while the page is back at the
    // very top, which looks broken. Deliberately one-directional: downward scrolling
    // over the body should move the page, not the rail.
    //
    // Wheel deltas are accumulated into a target and eased toward over successive
    // frames, rather than written straight to scrollTop. A wheel tick is a discrete
    // jump — the browser normally spreads that same distance across an animation, so
    // applying it in one assignment is what made this feel steppy next to a real scroll.
    let target = null;
    let frame = null;

    const stop = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      target = null;
    };

    const step = () => {
      const distance = target - rail.scrollTop;
      if (Math.abs(distance) < 0.5) {
        rail.scrollTop = target;
        stop();
        return;
      }
      rail.scrollTop += distance * 0.18; // ease out: fast at first, settling at the end

      // At the ceiling there is nothing left to ease toward. Snap and release the
      // loop now instead of creeping asymptotically toward zero, where it would
      // spend many frames pulling back against a downward scroll.
      if (target <= 0 && rail.scrollTop <= 1) {
        rail.scrollTop = 0;
        stop();
        return;
      }
      frame = requestAnimationFrame(step);
    };

    window.addEventListener(
      'wheel',
      (e) => {
        // Release first, ask questions later. A downward flick, or any gesture with
        // the pointer over the rail, means the user is driving now — an ease still
        // running toward an older target would pull against them.
        if (e.deltaY >= 0 || rail.contains(e.target)) return stop();
        if (window.scrollY > 0) return; // page still has room to scroll up

        const limit = rail.scrollHeight - rail.clientHeight;
        if (limit <= 0) return; // rail isn't scrollable at this size

        // Firefox reports deltas in lines, and page-scroll modes in pages. Treating
        // either as pixels would move the rail a few px per tick.
        const delta =
          e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * rail.clientHeight : e.deltaY;

        const from = target === null ? rail.scrollTop : target;
        if (from <= 0) return; // already at, or heading to, the top

        // Clamped so a long flick can't bank distance past the top and leave the
        // rail unresponsive to the next scroll down while it unwinds.
        target = Math.min(limit, Math.max(0, from + delta));

        if (reduceMotion) {
          rail.scrollTop = target;
          target = null;
          return;
        }
        if (frame === null) frame = requestAnimationFrame(step);
      },
      { passive: true },
    );
  });
})();
