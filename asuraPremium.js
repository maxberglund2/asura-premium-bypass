// ==UserScript==
// @name         ASURA+ Premium Bypass & Keyboard Navigation
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Removes ASURA+ premium popup & ad banner, adds keyboard navigation, and replaces low-res images with HD versions on AsuraScans.
// @author       greed
// @match        https://asuracomic.net/*
// @grant        none
// ==/UserScript==

(() => {
    const q = s => document.querySelector(s);

    const selectors = {
        modal: '.fixed.inset-0.bg-gray-900.bg-opacity-75',
        topAd: 'div.max-w-7xl.mx-auto.px-4.py-8.relative.z-20',
        subscriptionModal: '.fixed.inset-0.z-50.flex.items-center.justify-center.p-4.bg-black\\/60.backdrop-blur-md',
        prevLink: '.flex.items-center.gap-x-3.flex-row.w-full.sm\\:w-40.justify-between.sm\\:self-end a[href*="chapter"]:first-child',
        nextLink: '.flex.items-center.gap-x-3.flex-row.w-full.sm\\:w-40.justify-between.sm\\:self-end a[href*="chapter"]:last-child',
        imageContainer: 'div.py-8.-mx-5.md\\:mx-0.flex.flex-col.items-center.justify-center'
    };

    const tryRemove = selector => {
        const el = q(selector);
        if (el) el.remove();
        return !!el;
    };

    let removed = {
        modal: tryRemove(selectors.modal),
        ad: tryRemove(selectors.topAd),
        subscriptionModal: tryRemove(selectors.subscriptionModal)
    };

    if (!removed.modal || !removed.ad || !removed.subscriptionModal) {
        const interval = setInterval(() => {
            removed.modal ||= tryRemove(selectors.modal);
            removed.ad ||= tryRemove(selectors.topAd);
            removed.subscriptionModal ||= tryRemove(selectors.subscriptionModal);
            if (removed.modal && removed.ad && removed.subscriptionModal) clearInterval(interval);
        }, 500);
        setTimeout(() => clearInterval(interval), 10000);
    }

    document.addEventListener('keydown', e => {
        if (e.isComposing || ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
        if (e.key === 'ArrowLeft') {
            const prev = q(selectors.prevLink);
            if (prev?.href) location.href = prev.href;
        } else if (e.key === 'ArrowRight') {
            const next = q(selectors.nextLink);
            if (next?.href) location.href = next.href;
        }
    });

    const convertHD = src =>
        src.includes('/conversions/') && src.includes('-optimized')
            ? src.replace('/conversions', '').replace('-optimized', '')
            : null;

    const upgradeImages = () => {
        const container = q(selectors.imageContainer);
        if (!container) return;
        container.querySelectorAll('img[src*="-optimized"]').forEach(img => {
            const hd = convertHD(img.src);
            if (!hd) return;
            const original = img.src;
            img.src = hd;
            img.onerror = () => {
                img.src = original;
                img.onerror = null;
            };
        });
    };

    window.addEventListener('load', upgradeImages);
    new MutationObserver(upgradeImages).observe(document.body, { childList: true, subtree: true });
})();
