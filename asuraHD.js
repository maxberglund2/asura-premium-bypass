// ==UserScript==
// @name         ASURA+ Premium HD Quality
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes low-res images to HD versions on AsuraScans
// @author       greed
// @match        https://asuracomic.net/*
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  const upgradeImageSrc = src =>
    src.includes('/conversions/') && src.includes('-optimized')
      ? src.replace('/conversions', '').replace('-optimized', '')
      : null;

  const updateImagesInContainer = () => {
    const container = document.querySelector(
      'div.py-8.-mx-5.md\\:mx-0.flex.flex-col.items-center.justify-center'
    );
    if (!container) return;

    const images = container.querySelectorAll('img[src*="-optimized"]');

    images.forEach(img => {
      const hdSrc = upgradeImageSrc(img.src);
      if (!hdSrc) return;

      const originalSrc = img.src;

      // Try HD version
      img.src = hdSrc;

      // On error, revert to original
      img.onerror = () => {
        console.warn(`HD image failed to load, reverting: ${hdSrc}`);
        img.src = originalSrc;
        img.onerror = null; // Prevent loop in case original also fails
      };
    });
  };

  // Initial run
  window.addEventListener('load', updateImagesInContainer);

  // Observe dynamic changes
  const observer = new MutationObserver(updateImagesInContainer);
  observer.observe(document.body, { childList: true, subtree: true });
})();