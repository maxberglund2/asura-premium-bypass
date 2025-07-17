// ==UserScript==
// @name         ASURA+ Premium Bypass & Keyboard Navigation
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes ASURA+ premium popup and ad banner; adds keyboard navigation for previous and next chapters using arrow keys
// @author       greed
// @match        https://asuracomic.net/*
// @grant        none
// ==/UserScript==

(() => {
    const remove = (selector) => {
        const el = document.querySelector(selector);
        if (el) {
            el.remove();
            return true;
        }
        return false;
    };

    const selectors = {
        modal: '.fixed.inset-0.bg-gray-900.bg-opacity-75',
        topAd: 'div.max-w-7xl.mx-auto.px-4.py-8.relative.z-20',
        prevLink: '.flex.items-center.gap-x-3.flex-row.w-full.sm\\:w-40.justify-between.sm\\:self-end a[href*="chapter"]:first-child',
        nextLink: '.flex.items-center.gap-x-3.flex-row.w-full.sm\\:w-40.justify-between.sm\\:self-end a[href*="chapter"]:last-child'
    };

    let modalRemoved = remove(selectors.modal);
    let adRemoved = remove(selectors.topAd);

    if (!modalRemoved || !adRemoved) {
        const interval = setInterval(() => {
            modalRemoved = modalRemoved || remove(selectors.modal);
            adRemoved = adRemoved || remove(selectors.topAd);
            if (modalRemoved && adRemoved) clearInterval(interval);
        }, 500);
        setTimeout(() => clearInterval(interval), 10000);
    }

    document.addEventListener('keydown', e => {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.isComposing) return;
        if (e.key === 'ArrowLeft') {
            const prev = document.querySelector(selectors.prevLink);
            if (prev?.href) window.location.href = prev.href;
        }
        if (e.key === 'ArrowRight') {
            const next = document.querySelector(selectors.nextLink);
            if (next?.href) window.location.href = next.href;
        }
    });
})();