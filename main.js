/**
 * main.js — London editorial site
 * Progressive enhancement only. All content accessible without JS.
 */

'use strict';

// ─── Navigation ───────────────────────────────────────────────────────────────

function initNav() {
  const header  = document.getElementById('site-header');
  const toggle  = document.querySelector('.nav__toggle');
  const navList = document.getElementById('primary-nav-list');

  if (!header) return;

  // Sticky header style on scroll
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!toggle || !navList) return;

  // Reveal toggle (hidden without JS)
  toggle.hidden = false;

  const open = () => {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    navList.setAttribute('data-open', 'true');
    document.body.style.overflow = 'hidden';
    // Move focus to first link
    const firstLink = navList.querySelector('a');
    if (firstLink) firstLink.focus();
  };

  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    navList.setAttribute('data-open', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    toggle.getAttribute('aria-expanded') === 'true' ? close() : open();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
      toggle.focus();
    }
  });

  // Close on nav link click (smooth scroll to section)
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navList.getAttribute('data-open') === 'true') close();
    });
  });

  // Close when focus leaves nav
  navList.addEventListener('focusout', (e) => {
    if (!navList.contains(e.relatedTarget) && !toggle.contains(e.relatedTarget)) {
      close();
    }
  });
}


// ─── Scroll Reveal ────────────────────────────────────────────────────────────

function initScrollReveal() {
  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Make all elements visible immediately
    document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach(el => {
      el.setAttribute('data-revealed', 'true');
    });
    return;
  }

  const targets = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-revealed', 'true');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  targets.forEach(el => observer.observe(el));
}


// ─── Smooth scroll for anchor links ──────────────────────────────────────────

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const headerHeight = document.getElementById('site-header')?.offsetHeight ?? 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo({ top });
      } else {
        window.scrollTo({ top, behavior: 'smooth' });
      }

      // Set focus to the section for keyboard users
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}


// ─── Parallax hero image (subtle, performance-safe) ──────────────────────────

function initHeroParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroImg = document.querySelector('.hero__media img');
  if (!heroImg) return;

  let rafId = null;

  const onScroll = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      // Only apply while hero is in view
      if (scrollY < window.innerHeight * 1.5) {
        heroImg.style.transform = `translateY(${scrollY * 0.25}px)`;
      }
      rafId = null;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}


// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initSmoothScroll();
  initHeroParallax();
});
