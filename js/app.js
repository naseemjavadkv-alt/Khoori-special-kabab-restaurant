/* ==========================================================================
   Khoori ordering site – application logic
   You normally do NOT need to edit this file.
   Edit js/config.js (business details) and js/menu.js (dishes & prices).
   ========================================================================== */
(function () {
  'use strict';

  const R = window.RESTAURANT;
  const CATS = window.MENU_CATEGORIES || [];
  const CAT_IDS = new Set(CATS.map(c => c.id));
  const ITEMS = (window.MENU_ITEMS || []).filter(i => CAT_IDS.has(i.category));
  const BY_ID = new Map(ITEMS.map(i => [i.id, i]));
  const CAT_LABEL = Object.fromEntries(CATS.map(c => [c.id, c.label]));
  const DRAFT_KEY = R.cartStorageKey + '_customer';
  const MAX_QTY = 99;

  /* ------------------------------------------------------------------ utils */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }

  const ICONS = {
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3',
    whatsapp: 'M20 11.5a8 8 0 0 1-11.9 7L4 20l1.5-4A8 8 0 1 1 20 11.5ZM9 9c0 3 3 6 6 6l1-1.5-2-1-1 .8c-.8-.4-1.6-1.2-2-2l.8-1-1-2L9 9Z',
    pin: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
    phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z',
    check: 'M5 12.5l4.5 4.5L19 7.5'
  };
  function icon(name) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', ICONS[name]);
    svg.append(p);
    return svg;
  }

  const round2 = n => Math.round(n * 100) / 100;
  const money = n => `${R.currency} ${round2(n).toFixed(2)}`;
  const moneyShort = n => (Number.isInteger(n) ? String(n) : n.toFixed(2));
  const plural = (n, one, many) => (n === 1 ? one : many);

  function fmt12(hhmm) {
    const [hh, mm] = hhmm.split(':').map(Number);
    const suffix = hh >= 12 ? 'PM' : 'AM';
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${h12}:${String(mm).padStart(2, '0')} ${suffix}`;
  }
  const toMin = hhmm => { const [a, b] = hhmm.split(':').map(Number); return a * 60 + b; };
  const overnight = () => toMin(R.hours.close) <= toMin(R.hours.open) && R.hours.close !== R.hours.open;
  const hoursText = () => `${fmt12(R.hours.open)} – ${fmt12(R.hours.close)}${overnight() ? ' (next day)' : ''}`;

  function nowMinutes() {
    try {
      const parts = new Intl.DateTimeFormat('en-GB', { timeZone: R.timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
      return Number(parts.find(p => p.type === 'hour').value) * 60 + Number(parts.find(p => p.type === 'minute').value);
    } catch (e) {
      const d = new Date();
      return d.getHours() * 60 + d.getMinutes();
    }
  }
  function openStatus() {
    const o = toMin(R.hours.open), c = toMin(R.hours.close), n = nowMinutes();
    if (o === c) return { open: true, text: 'Open 24 hours' };
    const open = o < c ? (n >= o && n < c) : (n >= o || n < c);
    return open
      ? { open: true, text: `Open now, until ${fmt12(R.hours.close)}` }
      : { open: false, text: `Closed now, opens at ${fmt12(R.hours.open)}` };
  }

  /* ------------------------------------------------------------------ state */
  const state = { view: null, cat: 'all', q: '', stage: 'form', lastMsg: '', lastUrl: '' };
  const sizePick = {};            // item id -> selected size label
  let cart = loadCart();          // [{ id, size, qty }]

  function loadCart() {
    try {
      const arr = JSON.parse(localStorage.getItem(R.cartStorageKey) || '[]');
      if (!Array.isArray(arr)) return [];
      const out = [];
      for (const l of arr) {
        const it = l && BY_ID.get(l.id);
        const qty = Math.min(MAX_QTY, parseInt(l && l.qty, 10) || 0);
        if (!it || it.soldOut || qty < 1) continue;
        let size = null;
        if (it.sizes) size = it.sizes.some(s => s.label === l.size) ? l.size : it.sizes[0].label;
        const dup = out.find(x => x.id === it.id && x.size === size);
        if (dup) dup.qty = Math.min(MAX_QTY, dup.qty + qty); else out.push({ id: it.id, size, qty });
      }
      return out;
    } catch (e) { return []; }
  }
  function saveCart() {
    try { localStorage.setItem(R.cartStorageKey, JSON.stringify(cart)); } catch (e) { /* storage unavailable – cart still works this session */ }
  }

  const lineKey = (id, size) => (size ? `${id}|${size}` : id);
  function unitPrice(item, size) {
    if (item.sizes) { const s = item.sizes.find(x => x.label === size) || item.sizes[0]; return s.price; }
    return item.price;
  }
  function lines() {
    return cart.map(l => {
      const item = BY_ID.get(l.id);
      const unit = unitPrice(item, l.size);
      return { key: lineKey(l.id, l.size), item, size: l.size, qty: l.qty, unit, total: round2(unit * l.qty) };
    });
  }
  function totals() {
    const L = lines();
    const count = L.reduce((n, l) => n + l.qty, 0);
    const subtotal = round2(L.reduce((n, l) => n + l.total, 0));
    const fee = R.deliveryFee > 0 ? R.deliveryFee : 0;
    return { count, subtotal, fee, total: round2(subtotal + fee) };
  }
  const minOrderShort = () => (R.minOrder > 0 ? Math.max(0, round2(R.minOrder - totals().subtotal)) : 0);

  /* ---------------------------------------------------------------- toast */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1900);
  }

  /* ------------------------------------------------------------ cart actions */
  function addToCart(item, size) {
    const line = cart.find(l => l.id === item.id && l.size === size);
    if (line) {
      if (line.qty >= MAX_QTY) { toast(`Maximum ${MAX_QTY} per item`); return; }
      line.qty++;
    } else cart.push({ id: item.id, size, qty: 1 });
    afterCartChange();
    toast(`Added ${item.name}${size ? ` (${size})` : ''}`);
  }
  function changeQty(key, delta) {
    const i = cart.findIndex(l => lineKey(l.id, l.size) === key);
    if (i < 0) return;
    const next = cart[i].qty + delta;
    if (next > MAX_QTY) { toast(`Maximum ${MAX_QTY} per item`); return; }
    if (next < 1) cart.splice(i, 1); else cart[i].qty = next;
    afterCartChange();
  }
  function removeLine(key) {
    const i = cart.findIndex(l => lineKey(l.id, l.size) === key);
    if (i < 0) return;
    const name = BY_ID.get(cart[i].id).name;
    cart.splice(i, 1);
    afterCartChange();
    toast(`Removed ${name}`);
  }
  function clearCart() { cart = []; afterCartChange(); }

  function afterCartChange() {
    saveCart();
    updateBadges(true);
    refreshCards();
    if (state.view === 'cart') renderCart();
    if (state.view === 'checkout') renderCheckout();
  }

  function updateBadges(bump) {
    const { count, total } = totals();
    const badge = $('#nav-badge');
    badge.textContent = count;
    badge.hidden = count === 0;
    if (bump) { badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); }
    $('#cartbar-count').textContent = count;
    $('#cartbar-label').textContent = plural(count, 'item', 'items');
    $('#cartbar-total').textContent = money(total);
    $('#cartbar').hidden = count === 0 || !(state.view === 'menu' || state.view === 'home');
  }

  /* Keep keyboard focus on the same control after a re-render */
  function keepFocus(fn, fallbackSel) {
    const a = document.activeElement;
    const id = a && a.dataset ? a.dataset.focus : null;
    fn();
    if (id) {
      const n = document.querySelector(`[data-focus="${id}"]`);
      if (n) { n.focus({ preventScroll: true }); return; }
      const f = fallbackSel && $(fallbackSel);
      if (f) f.focus({ preventScroll: true });
    }
  }

  /* -------------------------------------------------------------- food cards */
  function makeCard(item, tile) {
    const media = h('div', { class: 'card-media' + (item.image ? '' : ' is-empty') + (item.fit === 'contain' ? ' contain' : '') });
    if (item.image) {
      const img = h('img', { src: item.image, alt: '', loading: 'lazy', decoding: 'async', width: 428, height: 290 });
      img.addEventListener('error', () => { img.remove(); media.classList.add('is-empty'); });
      media.append(img);
    }
    if (item.illustrative) media.append(h('span', { class: 'photo-note', text: 'Illustration' }));

    const sizesEl = item.sizes
      ? h('div', { class: 'sizes', role: 'group', 'aria-label': `Size for ${item.name}` },
          item.sizes.map(s => h('button', {
            type: 'button', class: 'size', 'aria-pressed': 'false', dataset: { size: s.label },
            onclick: () => { sizePick[item.id] = s.label; updateCard(card); }
          }, `${s.label} ${moneyShort(s.price)}`)))
      : null;

    const priceEl = h('span', { class: 'price' });
    const addBtn = h('button', { type: 'button', class: 'btn btn-saffron', 'aria-label': `Add ${item.name} to cart` }, icon('plus'), 'Add to cart');
    const minus = h('button', { type: 'button', 'aria-label': `Decrease quantity of ${item.name}` }, icon('minus'));
    const qtyEl = h('output', { 'aria-live': 'polite' });
    const plus = h('button', { type: 'button', 'aria-label': `Increase quantity of ${item.name}` }, icon('plus'));
    const stepper = h('div', { class: 'stepper', role: 'group', 'aria-label': `Quantity of ${item.name}` }, minus, qtyEl, plus);

    const curSize = () => (item.sizes ? (sizePick[item.id] || item.sizes[0].label) : null);
    addBtn.addEventListener('click', () => { addToCart(item, curSize()); plus.focus({ preventScroll: true }); });
    plus.addEventListener('click', () => addToCart(item, curSize()));
    minus.addEventListener('click', () => {
      const k = lineKey(item.id, curSize());
      const wasOne = (cart.find(l => lineKey(l.id, l.size) === k) || {}).qty === 1;
      changeQty(k, -1);
      if (wasOne) addBtn.focus({ preventScroll: true });
    });

    const card = h('article', { class: 'card' + (tile ? ' card--tile' : '') + (item.soldOut ? ' sold-out' : ''), dataset: { id: item.id } },
      media,
      h('div', { class: 'card-body' },
        h('h3', { class: 'card-title', text: item.name }),
        item.description ? h('p', { class: 'card-desc', title: item.description, text: item.description }) : null,
        sizesEl,
        h('div', { class: 'card-foot' }, priceEl, addBtn, stepper)));
    card._refs = { item, priceEl, addBtn, stepper, qtyEl, sizesEl, curSize };
    updateCard(card);
    return card;
  }

  function updateCard(card) {
    const { item, priceEl, addBtn, stepper, qtyEl, sizesEl, curSize } = card._refs;
    const size = curSize();
    if (sizesEl) $$('.size', sizesEl).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.size === size)));
    priceEl.textContent = money(unitPrice(item, size));
    const line = cart.find(l => l.id === item.id && l.size === size);
    card.classList.toggle('in-cart', cart.some(l => l.id === item.id));
    if (item.soldOut) {
      addBtn.disabled = true; addBtn.lastChild.textContent = 'Sold out'; addBtn.setAttribute('aria-label', `${item.name} is sold out`);
      addBtn.hidden = false; stepper.hidden = true;
      return;
    }
    addBtn.hidden = !!line;
    stepper.hidden = !line;
    if (line) qtyEl.textContent = line.qty;
  }
  function refreshCards() { $$('.card[data-id]').forEach(c => c._refs && updateCard(c)); }

  /* -------------------------------------------------------------------- menu */
  function matches(item, q) {
    if (!q) return true;
    const hay = `${item.name} ${item.description || ''} ${CAT_LABEL[item.category]}`.toLowerCase();
    return q.toLowerCase().split(/\s+/).filter(Boolean).every(t => hay.includes(t));
  }

  function renderChips() {
    const wrap = $('#chips');
    wrap.replaceChildren();
    const mk = (id, label) => h('button', {
      type: 'button', class: 'chip', 'aria-pressed': String(state.cat === id),
      onclick: () => {
        state.cat = id; renderChips(); renderMenu();
        const top = $('.chips-wrap').getBoundingClientRect().top + window.scrollY - $('.site-header').offsetHeight;
        if (window.scrollY > top) window.scrollTo({ top: Math.max(0, top) });
      }
    }, label);
    wrap.append(mk('all', 'All'), ...CATS.map(c => mk(c.id, c.label)));
  }

  function renderMenu() {
    const list = $('#menu-list');
    list.replaceChildren();
    const q = state.q.trim();
    let total = 0;
    CATS.forEach(cat => {
      if (state.cat !== 'all' && state.cat !== cat.id) return;
      const items = ITEMS.filter(i => i.category === cat.id && matches(i, q));
      if (!items.length) return;
      total += items.length;
      list.append(
        h('div', { class: 'cat-head', id: 'cat-' + cat.id }, h('h2', { text: cat.label }), h('span', { text: `${items.length} ${plural(items.length, 'dish', 'dishes')}` })),
        h('div', { class: 'grid' }, items.map(i => makeCard(i))));
    });
    $('#result-count').textContent = total
      ? `${total} ${plural(total, 'dish', 'dishes')}${q ? ` matching “${q}”` : ''}`
      : '';
    if (!total) {
      list.append(h('div', { class: 'empty', style: 'margin-top:20px' },
        h('h2', { text: q ? `No dishes match “${q}”` : 'Nothing here yet' }),
        h('p', { text: 'Try a different word, or show the whole menu again.' }),
        h('button', { type: 'button', class: 'btn btn-lapis', onclick: () => { state.q = ''; state.cat = 'all'; $('#search').value = ''; renderChips(); renderMenu(); $('#search').focus(); } }, 'Show all dishes')));
    }
  }

  function renderPopular() {
    const box = $('#popular');
    box.replaceChildren(...ITEMS.filter(i => i.popular).slice(0, 8).map(i => makeCard(i, true)));
    if (!box.children.length) box.closest('.section').hidden = true;
  }

  /* -------------------------------------------------------------------- cart */
  function emptyCart(msg) {
    const plate = (() => {
      const ns = 'http://www.w3.org/2000/svg';
      const s = document.createElementNS(ns, 'svg');
      s.setAttribute('viewBox', '0 0 96 96'); s.setAttribute('aria-hidden', 'true');
      s.innerHTML = '<circle cx="48" cy="52" r="34" fill="#e4edf8"/><circle cx="48" cy="52" r="26" fill="none" stroke="#2f6db5" stroke-opacity=".4" stroke-width="2"/><path d="M18 24c4-6 8-6 12 0M42 18c4-6 8-6 12 0M66 24c4-6 8-6 12 0" fill="none" stroke="#f2a81d" stroke-width="3" stroke-linecap="round"/>';
      return s;
    })();
    return h('div', { class: 'empty' }, plate,
      h('h2', { text: 'Your cart is empty' }),
      h('p', { text: msg || 'Pick something from the menu and it will show up here.' }),
      h('a', { class: 'btn btn-saffron btn-lg', href: '#menu' }, 'Explore menu'));
  }

  function summaryPanel(opts) {
    const t = totals();
    const short = minOrderShort();
    const panel = h('aside', { class: 'panel summary', 'aria-label': 'Order summary' }, h('h2', { text: 'Order summary' }));
    if (opts.lines) {
      panel.append(h('ul', { class: 'summary-lines' }, lines().map(l =>
        h('li', {}, h('span', { text: `${l.qty} × ${l.item.name}${l.size ? ` (${l.size})` : ''}` }), h('span', { text: money(l.total) })))));
    }
    panel.append(...[
      h('div', { class: 'sum-row' }, h('span', { text: `Items (${t.count})` }), h('span', { text: money(t.subtotal) })),
      t.fee > 0 ? h('div', { class: 'sum-row' }, h('span', { text: 'Delivery fee' }), h('span', { text: money(t.fee) })) : null,
      h('div', { class: 'sum-row total' }, h('span', { text: 'Total' }), h('span', { text: money(t.total) })),
      R.deliveryNote ? h('p', { class: 'sum-note', text: R.deliveryNote }) : null
    ].filter(Boolean));
    if (short > 0) panel.append(h('p', { class: 'error', style: 'display:block', text: `Minimum order is ${money(R.minOrder)}. Add ${money(short)} more to continue.` }));
    return panel;
  }

  function cartRow(l) {
    const stepper = h('div', { class: 'stepper', role: 'group', 'aria-label': `Quantity of ${l.item.name}` },
      h('button', { type: 'button', 'aria-label': `Decrease quantity of ${l.item.name}`, dataset: { focus: 'dec:' + l.key }, onclick: () => changeQty(l.key, -1) }, icon('minus')),
      h('output', { text: l.qty }),
      h('button', { type: 'button', 'aria-label': `Increase quantity of ${l.item.name}`, dataset: { focus: 'inc:' + l.key }, onclick: () => changeQty(l.key, 1) }, icon('plus')));
    return h('div', { class: 'cart-row' },
      h('div', { class: 'cart-thumb' + (l.item.image ? '' : ' is-empty') }, l.item.image ? h('img', { src: l.item.image, alt: '', width: 76, height: 76 }) : null),
      h('div', { class: 'cart-main' },
        h('div', {}, h('div', { class: 'cart-name', text: l.item.name }),
          h('div', { class: 'cart-meta', text: `${l.size ? l.size + ', ' : ''}${money(l.unit)} each` })),
        h('div', { class: 'cart-controls' }, stepper,
          h('button', { type: 'button', class: 'remove', 'aria-label': `Remove ${l.item.name} from cart`, onclick: () => removeLine(l.key) }, icon('trash'), 'Remove'),
          h('span', { class: 'line-total', text: money(l.total) }))));
  }

  function renderCart() {
    const root = $('#cart-root');
    keepFocus(() => {
      root.replaceChildren();
      if (!cart.length) { root.append(emptyCart()); return; }
      const short = minOrderShort();
      const place = h('a', { class: 'btn btn-saffron btn-block btn-lg', href: '#checkout', 'aria-disabled': short > 0 ? 'true' : null,
        onclick: e => { if (short > 0) e.preventDefault(); } }, 'Place order');
      const panel = summaryPanel({});
      panel.append(h('div', { class: 'stack' }, place,
        h('a', { class: 'btn btn-outline btn-block', href: '#menu' }, 'Continue shopping'),
        h('button', { type: 'button', class: 'text-btn cart-clear', onclick: () => { if (confirm('Remove everything from your cart?')) clearCart(); } }, 'Clear cart')));
      root.append(h('div', { class: 'layout' }, h('div', { class: 'cart-list' }, lines().map(cartRow)), panel));
    }, '#cart-title');
  }

  /* ---------------------------------------------------------- form helpers */
  function loadDraft() { try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function saveDraft(d) { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch (e) { /* ignore */ } }
  function clearDraft() { try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignore */ } }

  function setError(input, msg) {
    const err = document.getElementById(input.id + '-err');
    if (err) err.textContent = msg || '';
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    return !msg;
  }

  const V = {
    name(v) { v = v.trim(); return v.length >= 2 && /\p{L}/u.test(v) ? '' : 'Enter your name (at least 2 letters).'; },
    phone(v) { const d = v.replace(/[\s\-().]/g, ''); return /^\+?\d{8,15}$/.test(d) ? '' : 'Enter a valid phone number, for example 05X XXX XXXX or +971 5X XXX XXXX.'; },
    address(v) { return v.trim().length >= 8 ? '' : 'Enter your delivery address (building, street and area) so we can find you.'; },
    message(v) { return v.trim().length >= 5 ? '' : 'Write a short message (at least 5 characters).'; }
  };

  /* Returns { ok, url } – url is a clean Google Maps link, or '' when empty */
  function parseLocation(raw) {
    const v = raw.trim();
    if (!v) return { ok: true, url: '' };
    const coords = v.match(/^(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/);
    if (coords) return { ok: true, url: `https://www.google.com/maps?q=${coords[1]},${coords[2]}` };
    try {
      const u = new URL(/^https?:\/\//i.test(v) ? v : 'https://' + v);
      const host = u.hostname.toLowerCase();
      const okHost = /(^|\.)google\.[a-z.]+$/.test(host) || host === 'goo.gl' || host === 'maps.app.goo.gl' || host === 'g.co';
      if (okHost && u.protocol.startsWith('http')) return { ok: true, url: u.href };
    } catch (e) { /* fall through */ }
    return { ok: false, url: '' };
  }

  function field(id, label, control, opts = {}) {
    return h('div', { class: 'field' },
      h('label', { for: id }, label, opts.optional ? h('span', { class: 'opt', text: ' (optional)' }) : null),
      control,
      opts.after || null,
      h('p', { class: 'error', id: id + '-err', role: 'alert' }));
  }

  /* ---------------------------------------------------------------- checkout */
  function renderCheckout() {
    const root = $('#checkout-root');
    const title = $('#checkout-title');
    root.replaceChildren();

    if (state.stage === 'sent') { title.textContent = 'Almost done'; root.append(sentPanel()); return; }
    title.textContent = 'Delivery details';

    if (!cart.length) { root.append(emptyCart('Add something to your cart before checking out.')); return; }
    if (minOrderShort() > 0) {
      root.append(h('div', { class: 'empty' }, h('h2', { text: 'Minimum order not reached' }),
        h('p', { text: `The minimum order is ${money(R.minOrder)}. Add ${money(minOrderShort())} more to continue.` }),
        h('a', { class: 'btn btn-saffron', href: '#menu' }, 'Add more dishes')));
      return;
    }

    const draft = loadDraft();
    const mkInput = (id, extra) => h('input', Object.assign({ id, name: id, 'aria-describedby': id + '-err' }, extra));

    const name = mkInput('f-name', { autocomplete: 'name', maxlength: 60, value: draft.name || '' });
    const phone = mkInput('f-phone', { type: 'tel', inputmode: 'tel', autocomplete: 'tel', placeholder: '05X XXX XXXX', maxlength: 20, value: draft.phone || '' });
    const address = h('textarea', { id: 'f-address', name: 'address', rows: 3, maxlength: 300, autocomplete: 'street-address', placeholder: 'Building / villa, street, area, landmark', 'aria-describedby': 'f-address-err' }, draft.address || '');
    const loc = mkInput('f-loc', { type: 'text', inputmode: 'url', autocomplete: 'off', placeholder: 'Paste a Google Maps link', maxlength: 300, value: '' });
    const locStatus = h('p', { class: 'hint', id: 'f-loc-status', role: 'status' }, 'Optional, but it helps the driver find you faster.');
    const locBtn = h('button', { type: 'button', class: 'btn btn-outline' }, icon('pin'), 'Use my current location');
    const notes = h('textarea', { id: 'f-notes', name: 'notes', rows: 3, maxlength: 500, placeholder: 'Allergies, spice level, gate code, “no onions” …', 'aria-describedby': 'f-notes-err' }, draft.notes || '');

    const persist = () => saveDraft({ name: name.value, phone: phone.value, address: address.value, notes: notes.value });
    [name, phone, address, notes].forEach(i => i.addEventListener('input', persist));

    const validators = [
      [name, () => V.name(name.value)],
      [phone, () => V.phone(phone.value)],
      [address, () => V.address(address.value)],
      [loc, () => (parseLocation(loc.value).ok ? '' : 'Paste a Google Maps link (for example https://maps.app.goo.gl/…) or tap “Use my current location”.')]
    ];
    validators.forEach(([input, fn]) => {
      input.addEventListener('blur', () => { if (input.value.trim() || input.hasAttribute('aria-invalid')) setError(input, fn()); });
      input.addEventListener('input', () => { if (input.hasAttribute('aria-invalid')) setError(input, fn()); });
    });

    locBtn.addEventListener('click', () => {
      const say = (msg, cls) => { locStatus.textContent = msg; locStatus.className = 'hint' + (cls ? ' ' + cls : ''); };
      if (!('geolocation' in navigator)) return say('Your browser can’t share location. Paste a Google Maps link instead.', 'bad');
      if (window.isSecureContext === false) return say('Location sharing needs a secure (https) page. Paste a Google Maps link instead.', 'bad');
      locBtn.disabled = true; say('Waiting for your permission and location…');
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude, accuracy } = pos.coords;
        loc.value = `https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
        setError(loc, '');
        say(`Location added (accurate to about ${Math.round(accuracy)} m). You can still edit the link.`, 'ok');
        locBtn.disabled = false;
      }, err => {
        locBtn.disabled = false;
        const msgs = {
          1: 'Location permission was denied. Allow it in your browser settings, or paste a Google Maps link.',
          2: 'Couldn’t work out your location. Move to an open area, or paste a Google Maps link.',
          3: 'Finding your location took too long. Try again, or paste a Google Maps link.'
        };
        say(msgs[err.code] || msgs[2], 'bad');
      }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
    });

    const status = openStatus();
    const form = h('form', { class: 'panel', novalidate: true },
      status.open ? null : h('div', { class: 'notice', role: 'note' }, `We’re closed right now (opens at ${fmt12(R.hours.open)}). You can still send your order. We’ll reply once we’re open.`),
      field('f-name', 'Your name', name),
      field('f-phone', 'Phone number', phone),
      field('f-address', 'Delivery address', address),
      field('f-loc', 'Google Maps location', loc, { optional: true, after: h('div', {}, h('div', { class: 'loc-row' }, locBtn), locStatus) }),
      field('f-notes', 'Order notes', notes, { optional: true }),
      h('button', { type: 'submit', class: 'btn btn-wa btn-block btn-lg' }, icon('whatsapp'), 'Send order on WhatsApp'),
      h('p', { class: 'hint', text: 'This opens WhatsApp with your order already written. Your order is only sent when you tap Send in WhatsApp.' }));
    form.append(h('p', { class: 'error', id: 'f-form-err', role: 'alert' }));

    form.addEventListener('submit', e => {
      e.preventDefault();
      let first = null;
      validators.forEach(([input, fn]) => { const msg = fn(); setError(input, msg); if (msg && !first) first = input; });
      if (first) { first.focus(); return; }
      persist();
      sendOrder({
        name: name.value.trim(), phone: phone.value.trim(), address: address.value.trim(),
        location: parseLocation(loc.value).url, notes: notes.value.trim()
      });
    });

    root.append(h('div', { class: 'layout' },
      h('div', {}, h('a', { class: 'link back', href: '#cart' }, '← Back to cart'), form),
      summaryPanel({ lines: true })));
  }

  /* --------------------------------------------------------------- WhatsApp */
  function waNumber() { return String(R.whatsappNumber).replace(/\D/g, '').replace(/^0+/, ''); }
  function waUrl(text) { return `https://wa.me/${waNumber()}?text=${encodeURIComponent(text)}`; }
  function openWhatsApp(url) {
    const w = window.open(url, '_blank');
    if (w) { try { w.opener = null; } catch (e) { /* ignore */ } } else window.location.href = url;
  }

  function stamp() {
    try { return new Intl.DateTimeFormat('en-GB', { timeZone: R.timezone, dateStyle: 'medium', timeStyle: 'short' }).format(new Date()); }
    catch (e) { return new Date().toLocaleString(); }
  }

  function buildOrderMessage(v) {
    const t = totals();
    const rows = lines().map((l, i) =>
      `${i + 1}. ${l.item.name}${l.size ? ` (${l.size})` : ''} x${l.qty} @ ${money(l.unit)} = ${money(l.total)}`);
    return [
      `*New order – ${R.name}*`,
      `Placed: ${stamp()}`,
      '',
      `*Customer:* ${v.name}`,
      `*Phone:* ${v.phone}`,
      '',
      `*Items (${t.count}):*`,
      ...rows,
      '',
      `Subtotal: ${money(t.subtotal)}`,
      t.fee > 0 ? `Delivery fee: ${money(t.fee)}` : null,
      `*TOTAL: ${money(t.total)}*`,
      '',
      '*Delivery address:*',
      v.address,
      '',
      `*Google Maps location:* ${v.location || 'Not shared'}`,
      '',
      `*Special instructions:* ${v.notes || 'None'}`
    ].filter(x => x !== null).join('\n');
  }

  function sendOrder(values) {
    state.lastMsg = buildOrderMessage(values);
    state.lastUrl = waUrl(state.lastMsg);
    state.stage = 'sent';
    renderCheckout();
    window.scrollTo(0, 0);
    $('#checkout-title').focus({ preventScroll: true });
    openWhatsApp(state.lastUrl);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((res, rej) => {
      const ta = h('textarea', { style: 'position:fixed;opacity:0' }, text);
      document.body.append(ta); ta.select();
      try { document.execCommand('copy') ? res() : rej(); } catch (e) { rej(e); } finally { ta.remove(); }
    });
  }

  function sentPanel() {
    const copyNote = h('span', { class: 'copy-ok', role: 'status' });
    return h('div', { class: 'panel sent' },
      h('h2', { text: 'WhatsApp is opening with your order' }),
      h('p', {}, h('strong', { text: 'Your order has not been sent yet. ' }),
        'In WhatsApp, check the message and tap Send. The restaurant will reply there to confirm your order and delivery time.'),
      h('div', { class: 'row' },
        h('a', { class: 'btn btn-wa', href: state.lastUrl, target: '_blank', rel: 'noopener' }, icon('whatsapp'), 'Open WhatsApp again'),
        h('button', { type: 'button', class: 'btn btn-outline', onclick: () => copyText(state.lastMsg).then(() => { copyNote.textContent = 'Order text copied.'; }, () => { copyNote.textContent = 'Couldn’t copy. Use Open WhatsApp instead.'; }) }, 'Copy order text'),
        copyNote),
      h('details', {}, h('summary', { text: 'Preview the message' }), h('pre', { class: 'msg-preview', text: state.lastMsg })),
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn btn-outline', onclick: () => { state.stage = 'form'; renderCheckout(); } }, 'Edit my details'),
        h('button', { type: 'button', class: 'text-btn', onclick: () => { clearCart(); clearDraft(); state.stage = 'form'; location.hash = '#home'; toast('Cart cleared. Thank you!'); } }, 'I’ve sent it, start a new order')));
  }

  /* ------------------------------------------------------------------ contact */
  function renderContact() {
    const box = $('#contact-info');
    const hello = `Hello ${R.name}, I have a question.`;
    box.replaceChildren(...[
      h('div', { class: 'info-card' }, h('h2', { text: 'WhatsApp' }),
        h('p', { class: 'big', text: R.phoneDisplay }),
        h('p', { text: 'The fastest way to reach us.' }),
        h('div', { class: 'info-actions' }, h('a', { class: 'btn btn-wa', href: waUrl(hello), target: '_blank', rel: 'noopener' }, icon('whatsapp'), 'Chat on WhatsApp'))),
      h('div', { class: 'info-card' }, h('h2', { text: 'Call' }),
        h('p', { class: 'big', text: R.phoneDisplay }),
        h('div', { class: 'info-actions' }, h('a', { class: 'btn btn-outline', href: 'tel:' + R.phoneTel }, icon('phone'), 'Call now'))),
      h('div', { class: 'info-card' }, h('h2', { text: 'Opening hours' }),
        h('p', { class: 'big', text: `Every day, ${hoursText()}` }),
        h('p', { id: 'contact-status', text: openStatus().text })),
      h('div', { class: 'info-card' }, h('h2', { text: 'Address' }),
        h('p', { class: 'big', text: R.address }),
        R.mapsLink ? h('div', { class: 'info-actions' }, h('a', { class: 'btn btn-outline', href: R.mapsLink, target: '_blank', rel: 'noopener' }, icon('pin'), 'Get directions')) : null),
      R.email ? h('div', { class: 'info-card' }, h('h2', { text: 'Email' }), h('p', { class: 'big' }, h('a', { href: 'mailto:' + R.email, text: R.email }))) : null
    ].filter(Boolean));

    const form = $('#contact-form');
    const n = $('#c-name'), p = $('#c-phone'), m = $('#c-msg');
    const checks = [[n, V.name], [p, V.phone], [m, V.message]];
    checks.forEach(([input, fn]) => {
      input.addEventListener('blur', () => { if (input.value.trim() || input.hasAttribute('aria-invalid')) setError(input, fn(input.value)); });
      input.addEventListener('input', () => { if (input.hasAttribute('aria-invalid')) setError(input, fn(input.value)); });
    });
    const note = h('p', { class: 'hint', id: 'c-status', role: 'status' });
    form.append(note);
    form.addEventListener('submit', e => {
      e.preventDefault();
      let first = null;
      checks.forEach(([input, fn]) => { const msg = fn(input.value); setError(input, msg); if (msg && !first) first = input; });
      if (first) { note.textContent = ''; first.focus(); return; }
      const text = `Hello ${R.name},\n\n${m.value.trim()}\n\n– ${n.value.trim()}, ${p.value.trim()}`;
      note.className = 'hint ok';
      note.textContent = 'WhatsApp is opening. Your message is only sent when you tap Send there.';
      openWhatsApp(waUrl(text));
    });
  }

  /* ------------------------------------------------------------------ status */
  function renderStatus() {
    const s = openStatus();
    const pill = $('#status-pill');
    pill.dataset.open = s.open ? 'yes' : 'no';
    $('span', pill).textContent = s.text;
    const c = $('#contact-status');
    if (c) c.textContent = s.text;
  }

  /* ------------------------------------------------------------------ router */
  const ROUTES = { home: 'Home', menu: 'Menu', cart: 'Cart', checkout: 'Checkout', contact: 'Contact' };

  function route() {
    let name = (location.hash || '#home').slice(1).split('?')[0];
    if (!ROUTES[name]) name = 'home';
    const first = state.view === null;
    if (name !== state.view) {
      if (state.view === 'checkout') state.stage = 'form';
      state.view = name;
      $$('.view').forEach(v => { v.hidden = v.dataset.view !== name; });
      $$('.nav-link').forEach(a => {
        const active = a.dataset.nav === (name === 'checkout' ? 'cart' : name);
        if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
      document.title = (name === 'home' ? R.name : `${ROUTES[name]} – ${R.name}`) + (name === 'home' ? ' – Order Online' : '');
      if (name === 'cart') renderCart();
      if (name === 'checkout') renderCheckout();
      if (name === 'menu') refreshCards();
      window.scrollTo(0, 0);
      if (!first) { const hd = $(`.view[data-view="${name}"] h1`); if (hd) hd.focus({ preventScroll: true }); }
    }
    updateBadges(false);
  }

  /* -------------------------------------------------------------------- init */
  function init() {
    $$('[data-r="name"]').forEach(e => { e.textContent = R.name; });
    $$('[data-r="tagline"]').forEach(e => { e.textContent = R.tagline; });
    $$('[data-r="logo"]').forEach(e => { e.src = R.logo; });
    $('#hero-hours').textContent = hoursText();
    $('#year').textContent = new Date().getFullYear();

    renderChips();
    renderMenu();
    renderPopular();
    renderContact();
    renderStatus();
    setInterval(renderStatus, 30000);

    let t;
    const search = $('#search');
    search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = search.value; renderMenu(); }, 120); });
    search.addEventListener('keydown', e => {
      if (e.key === 'Escape' && search.value) { search.value = ''; state.q = ''; renderMenu(); }
      if (e.key === 'Enter') e.preventDefault();
    });

    window.addEventListener('hashchange', route);
    window.addEventListener('storage', e => {          // keep several open tabs in sync
      if (e.key === R.cartStorageKey) { cart = loadCart(); afterCartChange(); }
    });
    route();
  }

  init();
})();
