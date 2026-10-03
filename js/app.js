/* Emy Creative — app logic. Vanilla JS, no build step. Data: products.js · Copy: translations.js */
(function () {
  "use strict";
  var P = window.PRODUCTS, T = window.T, SITE = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var state = { lang: "ar", filter: "all", cart: [], lastFocus: null };

  /* ---------- safe storage ---------- */
  function sGet(k, store) { try { return (store || localStorage).getItem(k); } catch (e) { return null; } }
  function sSet(k, v, store) { try { (store || localStorage).setItem(k, v); } catch (e) {} }
  function loadCart() { try { var c = JSON.parse(sGet("emy.cart") || "[]"); state.cart = c.filter(function (i) { return find(i.slug); }); } catch (e) { state.cart = []; } }
  function saveCart() { sSet("emy.cart", JSON.stringify(state.cart)); }

  /* ---------- helpers ---------- */
  function find(slug) { return P.filter(function (p) { return p.slug === slug; })[0]; }
  function tr() { return T[state.lang]; }
  function get(obj, path) { return path.split(".").reduce(function (o, k) { return o && o[k]; }, obj); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(n) { return new Intl.NumberFormat(state.lang === "ar" ? "ar-EG" : "en-US").format(n) + " " + SITE.CURRENCY[state.lang]; }
  function priceText(p) { return p.price == null ? tr().card.requestPrice : money(p.price); }
  function nm(p) { return p.name[state.lang] || p.name.en; }
  function oneOfKind(p) { return p.badge === "oneofakind"; }
  function isCustom(p) { return p.group === "custom"; }
  function cardImg(p) {
    if (!p.photo) return "";
    return '<picture><source type="image/webp" srcset="assets/originals/' + p.photo + '-450.webp 450w, assets/originals/' + p.photo + '.webp 900w" sizes="(max-width:560px) 50vw,(max-width:980px) 50vw, 380px"><img src="assets/originals/' + p.photo + '-450.jpg" width="900" height="1200" loading="lazy" alt="' + esc(nm(p) + " — " + p.tagline.en) + '"></picture>';
  }
  function img(p, size) {
    if (!p.photo) return "";
    var s = size === "big" ? 'srcset="assets/products/' + p.photo + '-600.webp 600w, assets/products/' + p.photo + '.webp 1200w" sizes="(max-width:860px) 100vw, 520px"' : 'srcset="assets/products/' + p.photo + '-600.webp 600w, assets/products/' + p.photo + '.webp 1200w" sizes="(max-width:560px) 50vw,(max-width:980px) 50vw, 380px"';
    return '<picture><source type="image/webp" ' + s + '><img src="assets/products/' + p.photo + '-600.jpg" width="1200" height="1200" alt="' + esc(nm(p) + " — " + p.tagline.en) + '"' + (size === "big" ? ' fetchpriority="high"' : ' loading="lazy"') + "></picture>";
  }
  var NOPHOTO = '<svg viewBox="0 0 60 90" width="34" height="51" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M30 4C38 22 52 34 52 56c0 18-10 30-22 30S8 74 8 56c0-14 8-20 14-30 3 8 6 10 8 12 2-10 0-22 0-34z"/></svg>';
  function toast(msg) { var t = $("#toast"); t.textContent = msg; t.hidden = false; requestAnimationFrame(function () { t.classList.add("show"); }); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.hidden = true; }, 350); }, 2800); }
  function waLink(text) { var base = "https://wa.me/" + (SITE.PHONE ? SITE.PHONE.replace(/\D/g, "") : "") + "?text="; return base + encodeURIComponent(text || ""); }

  /* ---------- i18n ---------- */
  function applyLang(animate) {
    var t = tr(), root = document.documentElement;
    var run = function () {
      root.lang = t.code; root.dir = t.dir; document.title = t.meta.title;
      $('meta[name="description"]').setAttribute("content", t.meta.desc);
      $$("[data-t]").forEach(function (el) { var v = get(t, el.getAttribute("data-t")); if (typeof v === "string") el.textContent = v; });
      aiRefresh();
      $("#langBtn").setAttribute("aria-label", t.a11y.langSwitch);
      $("#cartBtn").setAttribute("aria-label", t.a11y.openCart); $("#menuBtn").setAttribute("aria-label", t.a11y.menu);
      $("#introSkip").textContent = t.skip;
      $("#drawerTitle").textContent = t.cartUi.title;
      $("#customFormTitle").textContent = t.custom.formTitle; $("#cfName").textContent = t.custom.name; $("#cfColors").textContent = t.custom.colors; $("#cfScent").textContent = t.custom.scent; $("#cfNotes").textContent = t.custom.notes;
      $("#cfSend").textContent = t.custom.send; $("#cfClose").textContent = t.custom.close;
      var f = $("#customForm"); f.name.placeholder = t.custom.ph.name; f.colors.placeholder = t.custom.ph.colors; f.scent.placeholder = t.custom.ph.scent; f.notes.placeholder = t.custom.ph.notes;
      $("#marquee").innerHTML = [0, 1].map(function () { return t.marquee.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join(""); }).join("") + [0, 1].map(function () { return t.marquee.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join(""); }).join("");
      renderChips(); renderGrid(false); renderCart(); renderLinks();
      if (state.openSlug) renderDetail(state.openSlug);
    };
    if (animate && !reduce) { document.body.classList.add("fading"); setTimeout(function () { run(); document.body.classList.remove("fading"); }, 220); } else run();
  }
  function setLang(l) { state.lang = l; sSet("emy.lang", l); applyLang(true); }

  /* ---------- links (single PHONE variable) ---------- */
  function renderLinks() {
    var hello = tr().msg.hello.replace(/:$/, "");
    ["#waHeader", "#waHero", "#waFoot"].forEach(function (s) { var a = $(s); if (a) a.href = waLink(hello); });
    ["#socWa"].forEach(function (s) { var a = $(s); if (a) a.href = waLink(hello); });
    function setLink(sel, url) { var a = $(sel); if (!a) return; if (url) { a.href = url; a.removeAttribute("aria-disabled"); a.style.opacity = ""; a.title = ""; } else { a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); a.style.opacity = ".5"; a.title = "TBD"; } }
    setLink("#socIg", SITE.INSTAGRAM); setLink("#socFb", SITE.FACEBOOK); setLink("#fbLink", SITE.FACEBOOK);
    var pi = $("#payInsta"), pv = $("#payVoda"); if (pi) pi.textContent = SITE.INSTAPAY || "TBD"; if (pv) pv.textContent = SITE.VODAFONE_CASH || "TBD";
    var ig = $("#igLink"); if (SITE.INSTAGRAM) { ig.href = SITE.INSTAGRAM; ig.hidden = false; } else { ig.removeAttribute("href"); ig.setAttribute("aria-disabled", "true"); ig.title = "TBD"; ig.style.opacity = ".5"; }
  }

  /* ---------- chips + grid (FLIP) ---------- */
  var GROUPS = ["all", "floral", "cozy", "bubble", "figures", "limited", "custom"];
  function renderChips() {
    var t = tr();
    $("#chips").innerHTML = GROUPS.map(function (g) { return '<button type="button" class="chip" role="tab" data-g="' + g + '" aria-selected="' + (state.filter === g) + '">' + esc(t.coll[g]) + "</button>"; }).join("");
  }
  function sorted() { return P.slice().sort(function (a, b) { return a.order - b.order; }); }
  function cardHTML(p) {
    var t = tr(), b = p.badge === "oneofakind" ? t.card.badgeOne : p.badge === "madetoorder" ? t.card.badgeMade : "";
    var ph = p.photo ? '<button type="button" class="ph" data-open="' + p.slug + '" aria-label="' + esc(nm(p)) + '">' + cardImg(p) + (b ? '<span class="badge">' + esc(b) + "</span>" : "") + "</button>"
      : '<button type="button" class="ph none" data-open="' + p.slug + '" aria-label="' + esc(nm(p)) + '"><div>' + NOPHOTO + "<span>" + esc(t.card.photoSoon) + "</span></div>" + (b ? '<span class="badge">' + esc(b) + "</span>" : "") + "</button>";
    var label = isCustom(p) ? t.custom.cta : oneOfKind(p) ? t.card.reserve : t.card.add;
    var done = inCart(p.slug) && !isCustom(p);
    return '<article class="card" data-slug="' + p.slug + '" data-g="' + p.group + '">' + ph + '<div class="card-body"><h3>' + esc(nm(p)) + '</h3><p class="tag">' + esc(p.tagline[state.lang]) + '</p><p class="price">' + esc(priceText(p)) + '</p><button type="button" class="add' + (done ? " done" : "") + '" data-add="' + p.slug + '">' + esc(label) + "</button></div></article>";
  }
  function renderGrid(flip) {
    var grid = $("#grid"), list = sorted().filter(function (p) { return state.filter === "all" || p.group === state.filter; });
    var before = {};
    if (flip && !reduce) $$(".card", grid).forEach(function (c) { before[c.dataset.slug] = c.getBoundingClientRect(); });
    grid.innerHTML = list.length ? list.map(cardHTML).join("") : '<p class="empty" style="grid-column:1/-1">' + esc(tr().coll.empty) + "</p>";
    if (flip && !reduce) {
      $$(".card", grid).forEach(function (c, i) {
        var a = before[c.dataset.slug], b = c.getBoundingClientRect();
        if (a) { var dx = a.left - b.left, dy = a.top - b.top; if (dx || dy) c.animate([{ transform: "translate(" + dx + "px," + dy + "px)" }, { transform: "none" }], { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" }); }
        else c.animate([{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: i * 40, easing: "ease-out", fill: "backwards" });
      });
    } else observeCards();
    JSONLD();
  }
  function observeCards() {
    var cards = $$(".card", $("#grid")); if (reduce || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.animate([{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }], { duration: 700, easing: "ease-out", fill: "backwards", delay: (e.target.dataset.idx % 3) * 60 }); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    cards.forEach(function (c, i) { c.dataset.idx = i; io.observe(c); });
  }

  /* ---------- cart ---------- */
  function inCart(slug) { return state.cart.some(function (i) { return i.slug === slug; }); }
  function count() { return state.cart.reduce(function (n, i) { return n + i.qty; }, 0); }
  function updateBadge(pop) { var c = $("#cartCount"), n = count(); c.textContent = n; c.hidden = n === 0; if (pop && !reduce) { c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop"); } }
  function addToCart(slug, srcEl) {
    var p = find(slug); if (!p) return;
    var row = state.cart.filter(function (i) { return i.slug === slug; })[0];
    if (row) { if (!oneOfKind(p)) row.qty += 1; } else state.cart.push({ slug: slug, qty: 1 });
    saveCart(); updateBadge(true);
    var btn = $('[data-add="' + slug + '"]');
    if (btn) { btn.classList.add("done"); var old = btn.textContent; btn.textContent = "✓ " + tr().card.added; setTimeout(function () { btn.textContent = oneOfKind(p) ? tr().card.reserve : tr().card.add; btn.classList.remove("done"); }, 1400); }
    flyToCart(srcEl || (btn && btn.closest(".card") && $("img", btn.closest(".card"))));
    renderCart();
  }
  function flyToCart(imgEl) {
    if (reduce || !imgEl) return;
    var a = imgEl.getBoundingClientRect(), b = $("#cartBtn").getBoundingClientRect(); if (!a.width) return;
    var f = document.createElement("img"); f.src = imgEl.currentSrc || imgEl.src; f.className = "fly"; f.style.cssText = "left:" + a.left + "px;top:" + a.top + "px;width:" + a.width + "px;height:" + a.height + "px";
    document.body.appendChild(f);
    var an = f.animate([{ transform: "none", opacity: 1 }, { transform: "translate(" + (b.left + b.width / 2 - a.left - a.width / 2) + "px," + (b.top + b.height / 2 - a.top - a.height / 2) + "px) scale(.12)", opacity: .2 }], { duration: 750, easing: "cubic-bezier(.5,0,.7,.4)" });
    an.onfinish = function () { f.remove(); };
  }
  function setQty(slug, d) { var r = state.cart.filter(function (i) { return i.slug === slug; })[0]; if (!r) return; r.qty = Math.max(1, r.qty + d); saveCart(); updateBadge(); renderCart(); }
  function removeItem(slug) { state.cart = state.cart.filter(function (i) { return i.slug !== slug; }); saveCart(); updateBadge(); renderCart(); renderGrid(false); }
  function total() { var sum = 0, any = false; state.cart.forEach(function (i) { var p = find(i.slug); if (p.price != null) { sum += p.price * i.qty; any = true; } }); return any ? sum : null; }
  var checkout = false;
  function renderCart() {
    var t = tr().cartUi, body = $("#drawerBody"); updateBadge();
    if (!state.cart.length) { checkout = false; body.innerHTML = '<p class="empty">' + esc(t.empty) + "</p>"; return; }
    if (checkout) {
      body.innerHTML = '<form class="checkout" id="coForm" novalidate><h3 class="drawer-title" style="font-size:26px">' + esc(t.formTitle) + '</h3>' +
        [["name", t.name, "text"], ["phone", t.phone, "tel"], ["city", t.city, "text"], ["address", t.address, "text"]].map(function (f) { return '<label><span>' + esc(f[1]) + ' *</span><input name="' + f[0] + '" type="' + f[2] + '" required autocomplete="off"></label>'; }).join("") +
        '<fieldset class="paybox"><legend>' + esc(t.pay) + ' *</legend><label class="radio"><input type="radio" name="pay" value="instapay" checked> <span>' + esc(t.payInsta) + '</span></label><label class="radio"><input type="radio" name="pay" value="vodafone"> <span>' + esc(t.payVoda) + '</span></label></fieldset><label><span>' + esc(t.notes) + '</span><textarea name="notes" rows="3"></textarea></label><p class="form-err" id="coErr" role="alert" hidden></p>' + (SITE.PHONE ? "" : '<p class="form-note">' + esc(t.noPhone) + "</p>") +
        '<div class="form-actions"><button type="submit" class="btn">' + esc(t.send) + '</button><button type="button" class="btn-ghost" id="coBack">' + esc(t.back) + "</button></div></form>";
      return;
    }
    var tot = total();
    body.innerHTML = state.cart.map(function (i, k) {
      var p = find(i.slug);
      return '<div class="line-item" style="--i:' + k + '">' + (p.photo ? '<img src="assets/products/' + p.photo + '-600.jpg" alt="" width="72" height="72">' : '<div class="ph0"></div>') +
        '<div><div class="nm">' + esc(nm(p)) + '</div><div class="pr">' + esc(priceText(p)) + '</div>' +
        (oneOfKind(p) ? '<div class="qty fixed">1</div>' : '<div class="qty"><button type="button" data-q="-1" data-s="' + p.slug + '" aria-label="-">−</button><span>' + i.qty + '</span><button type="button" data-q="1" data-s="' + p.slug + '" aria-label="+">+</button></div>') +
        '</div><button type="button" class="rm" data-rm="' + p.slug + '">' + esc(t.remove) + "</button></div>";
    }).join("") + '<div class="cart-total"><span>' + esc(t.total) + '</span><span>' + esc(tot == null ? t.priceOnReq : money(tot)) + '</span></div><p class="cart-note">' + esc(t.totalNote) + '</p><button type="button" class="btn" id="coGo">' + esc(t.checkout) + "</button>";
  }
  function buildOrderMessage(d) {
    var m = tr().msg, lines = [m.hello, ""];
    state.cart.forEach(function (i) { var p = find(i.slug); lines.push("• " + p.name.en + " " + m.qty + i.qty + " — " + (p.price == null ? m.poq : money(p.price * i.qty))); });
    var tot = total(); lines.push("", m.total + ": " + (tot == null ? m.poq : money(tot)), "", m.name + ": " + d.name, m.phone + ": " + d.phone, m.city + ": " + d.city, m.address + ": " + d.address);
    lines.push(m.pay + ": " + (d.pay === "vodafone" ? tr().cartUi.payVoda : tr().cartUi.payInsta)); if (d.notes) lines.push(m.notes + ": " + d.notes); return lines.join("\n");
  }

  /* ---------- overlays (a11y: focus, esc) ---------- */
  function openLayer(el, focusSel) { state.lastFocus = document.activeElement; el.hidden = false; requestAnimationFrame(function () { el.classList.add("show"); }); document.body.style.overflow = "hidden"; var f = $(focusSel, el) || el; if (f.focus) setTimeout(function () { f.focus(); }, 60); }
  function closeLayer(el, cb) { el.classList.remove("show"); setTimeout(function () { el.hidden = true; if (!$$(".overlay.show,.drawer.show").length) document.body.style.overflow = ""; if (cb) cb(); }, reduce ? 0 : 320); if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus(); }
  function openDrawer() { checkout = false; renderCart(); $("#backdrop").hidden = false; requestAnimationFrame(function () { $("#backdrop").classList.add("show"); }); openLayer($("#drawer"), "#drawerClose"); }
  function closeDrawer() { $("#backdrop").classList.remove("show"); setTimeout(function () { $("#backdrop").hidden = true; }, 330); closeLayer($("#drawer")); }

  /* ---------- product detail (shareable URL /candle/slug) ---------- */
  function related(p) { var same = sorted().filter(function (x) { return x.slug !== p.slug && x.group === p.group && x.photo; }); var rest = sorted().filter(function (x) { return x.slug !== p.slug && x.group !== p.group && x.photo; }); return same.concat(rest).slice(0, 3); }
  function renderDetail(slug) {
    var p = find(slug); if (!p) return; var t = tr(), d = t.detail;
    var facts = [[d.scent, p.scent], [d.weight, p.weight], [d.burn, p.burn]].filter(function (f) { return f[1]; });
    var label = isCustom(p) ? t.custom.cta : oneOfKind(p) ? t.card.reserve : t.card.add;
    $("#detailIn").innerHTML = '<div class="detail-top"><button type="button" class="back" id="dBack">' + (t.dir === "rtl" ? "→" : "←") + " " + esc(d.back) + '</button><button type="button" class="icon-btn" id="dClose" aria-label="Close"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="detail-grid"><div class="d-photo' + (p.photo ? "" : " none") + '">' + (p.photo ? img(p, "big") : "<div>" + NOPHOTO + "<br><span>" + esc(t.card.photoSoon) + "</span></div>") + "</div>" +
      '<div class="d-info"><h2 class="d-name" id="detailName">' + esc(nm(p)) + '</h2><p class="d-tag">' + esc(p.tagline[state.lang]) + '</p><div class="d-story"><h3>' + esc(d.story) + "</h3><p>" + esc(p.story[state.lang]) + "</p></div>" +
      (facts.length ? '<div class="d-facts"><dl class="facts">' + facts.map(function (f) { return "<dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd>"; }).join("") + "</dl></div>" : "") +
      '<p class="d-price">' + esc(priceText(p)) + '</p><div class="d-actions"><button type="button" class="btn" id="dAdd">' + esc(label) + "</button></div></div></div>" +
      '<div class="related"><h3>' + esc(d.like) + '</h3><div class="rel-grid">' + related(p).map(function (r) { return '<button type="button" class="rel" data-open="' + r.slug + '">' + img(r) + '<span class="nm">' + esc(nm(r)) + "</span></button>"; }).join("") + "</div></div>";
    $("#dAdd").onclick = function () { if (isCustom(p)) { closeDetail(true); openCustom(); } else addToCart(p.slug, $(".d-photo img")); };
    $("#dBack").onclick = closeDetail; $("#dClose").onclick = closeDetail;
    document.title = nm(p) + " — Emy Creative";
  }
  function openDetail(slug, push) {
    var p = find(slug); if (!p) return; state.openSlug = slug; renderDetail(slug);
    var el = $("#detail"), was = !el.hidden; if (!was) openLayer(el, "#dBack"); else $("#detailIn").scrollIntoView({ block: "start" });
    el.scrollTop = 0; if (push !== false) history.pushState({ slug: slug }, "", "#/candle/" + slug); setMetaFor(p);
  }
  function closeDetail(silent) { var el = $("#detail"); if (el.hidden) return; state.openSlug = null; closeLayer(el); if (silent !== true && /^#\/candle\//.test(location.hash)) history.pushState({}, "", location.pathname + location.search); document.title = tr().meta.title; setMetaFor(null); }
  function setMetaFor(p) { var d = $('meta[name="description"]'); d.setAttribute("content", p ? p.story[state.lang] : tr().meta.desc); }

  /* ---------- JSON-LD (no price when TBD) ---------- */
  function JSONLD() {
    var s = $("#ld"); if (!s) { s = document.createElement("script"); s.type = "application/ld+json"; s.id = "ld"; document.head.appendChild(s); }
    s.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": P.map(function (p) { var o = { "@type": "Product", name: p.name.en, description: p.story.en, brand: { "@type": "Brand", name: "Emy Creative" }, url: location.origin + location.pathname + "#/candle/" + p.slug }; if (p.photo) o.image = location.origin + "assets/products/" + p.photo + ".jpg"; if (p.price != null) o.offers = { "@type": "Offer", priceCurrency: "EGP", price: p.price, availability: oneOfKind(p) ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock" }; return o; }) });
  }

  /* ---------- custom name form ---------- */
  function openCustom() { openLayer($("#customModal"), "#customForm input"); }
  function bindCustom() {
    $("#customOpen").onclick = openCustom; $("#cfClose").onclick = function () { closeLayer($("#customModal")); };
    $("#customForm").addEventListener("submit", function (e) {
      e.preventDefault(); var f = e.target, m = tr().msg, err = $("#cfErr");
      if (!f.name.value.trim()) { err.textContent = tr().cartUi.required; err.hidden = false; f.name.focus(); return; } err.hidden = true;
      var lines = [m.custom, "", m.cname + ": " + f.name.value.trim()]; if (f.colors.value.trim()) lines.push(m.ccolors + ": " + f.colors.value.trim()); if (f.scent.value.trim()) lines.push(m.cscent + ": " + f.scent.value.trim()); if (f.notes.value.trim()) lines.push(m.notes + ": " + f.notes.value.trim());
      if (!SITE.PHONE) toast(tr().cartUi.noPhone); window.open(waLink(lines.join("\n")), "_blank", "noopener");
    });
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open],[data-add],[data-q],[data-rm],.chip,#coGo,#coBack"); if (!t) return;
    if (t.dataset.open) { e.preventDefault(); openDetail(t.dataset.open); }
    else if (t.dataset.add) { var p = find(t.dataset.add); if (isCustom(p)) openCustom(); else addToCart(p.slug); }
    else if (t.dataset.q) setQty(t.dataset.s, +t.dataset.q);
    else if (t.dataset.rm) removeItem(t.dataset.rm);
    else if (t.classList.contains("chip")) { state.filter = t.dataset.g; renderChips(); renderGrid(true); }
    else if (t.id === "coGo") { checkout = true; renderCart(); $("#coForm input").focus(); }
    else if (t.id === "coBack") { checkout = false; renderCart(); }
  });
  document.addEventListener("submit", function (e) {
    if (e.target.id !== "coForm") return; e.preventDefault();
    var f = e.target, d = { name: f.name.value.trim(), phone: f.phone.value.trim(), city: f.city.value.trim(), address: f.address.value.trim(), notes: f.notes.value.trim(), pay: (f.querySelector('input[name=pay]:checked') || {}).value || "instapay" }, err = $("#coErr");
    if (!d.name || !d.phone || !d.city || !d.address) { err.textContent = tr().cartUi.required; err.hidden = false; return; }
    if (!SITE.PHONE) toast(tr().cartUi.noPhone); window.open(waLink(buildOrderMessage(d)), "_blank", "noopener");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!$("#customModal").hidden) closeLayer($("#customModal")); else if (!$("#detail").hidden) closeDetail(); else if (!$("#drawer").hidden) closeDrawer(); else if (!$("#intro").hidden) endIntro();
  });
  window.addEventListener("hashchange", function () { var m = location.hash.match(/^#\/candle\/([\w-]+)/); if (m && find(m[1])) openDetail(m[1], false); else if (!$("#detail").hidden) { state.openSlug = null; closeLayer($("#detail")); document.title = tr().meta.title; } });
  ["#detail", "#customModal"].forEach(function (s) { $(s).addEventListener("click", function (e) { if (e.target === e.currentTarget) { if (s === "#detail") closeDetail(); else closeLayer($(s)); } }); });
  $("#backdrop").onclick = closeDrawer; $("#drawerClose").onclick = closeDrawer; $("#cartBtn").onclick = openDrawer;
  $("#langBtn").onclick = function () { setLang(state.lang === "ar" ? "en" : "ar"); };
  $("#menuBtn").onclick = function () { var o = $("#nav").classList.toggle("open"); this.setAttribute("aria-expanded", o); };
  $$("#nav a").forEach(function (a) { a.addEventListener("click", function () { $("#nav").classList.remove("open"); $("#menuBtn").setAttribute("aria-expanded", "false"); }); });
  // anchor links when a product page is open or from /candle/* path
  
  window.addEventListener("scroll", function () { $("#header").classList.toggle("small", window.scrollY > 40); }, { passive: true });

  /* ---------- scroll reveals + letters ---------- */
  function initReveal() {
    var els = $$(".reveal"); if (reduce || !("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("static"); }); $("#letters").classList.add("in"); return; }
    $$(".reveal").forEach(function (e, i) { e.style.setProperty("--d", (i % 4) * 0.08 + "s"); });
    $$("#letters span").forEach(function (s, i) { s.style.setProperty("--i", i); });
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { io.observe(e); });
    var lt = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); lt.disconnect(); } }); }, { threshold: .6 }); lt.observe($("#letters"));
  }

  /* ---------- hero 3D tilt (mouse on desktop, drag on touch) + cursor ---------- */
  function initHero3D() {
    var box = $("#hero3d"); if (!box) return; var wrap = $("#heroMedia"), tgt = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, live = false, raf = 0, t0 = Date.now();
    var shadow = $(".h3-shadow", box);
    function frame() {
      var t = (Date.now() - t0) / 1000;
      if (!live && !reduce) { tgt.x = Math.sin(t * .7) * .25; tgt.y = Math.cos(t * .9) * .18; }
      cur.x += (tgt.x - cur.x) * .08; cur.y += (tgt.y - cur.y) * .08;
      var fl = reduce ? 0 : Math.sin(t * 1.2) * 6;
      box.style.transform = "translateY(" + fl.toFixed(2) + "px) rotateY(" + (cur.x * 16).toFixed(2) + "deg) rotateX(" + (-cur.y * 12).toFixed(2) + "deg)";
      box.style.setProperty("--gx", (50 + cur.x * 46) + "%"); box.style.setProperty("--gy", (45 + cur.y * 46) + "%");
      if (shadow) shadow.style.transform = "translate(" + (-cur.x * 40).toFixed(1) + "px," + (cur.y * 6).toFixed(1) + "px) scale(" + (1 + fl * 0.004).toFixed(3) + ")";
      raf = requestAnimationFrame(frame);
    }
    function pos(e) { var r = wrap.getBoundingClientRect(); tgt.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - .5) * 2)); tgt.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - .5) * 2)); live = true; }
    if (reduce) { box.style.transform = "none"; return; }
    window.addEventListener("pointermove", function (e) { var r = wrap.getBoundingClientRect(); if (e.clientY > r.top - 220 && e.clientY < r.bottom + 220 && e.clientX > r.left - 260 && e.clientX < r.right + 260) pos(e); else live = false; }, { passive: true });
    wrap.addEventListener("pointerleave", function () { live = false; }); wrap.addEventListener("pointerup", function () { live = false; });
    new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { if (!raf) frame(); } else { cancelAnimationFrame(raf); raf = 0; } }); }).observe(wrap);
  }
  function initDesktopFx() {
    if (reduce || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    window.addEventListener("mousemove", function (e) { var c = $("#cursor"); c.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)"; c.classList.add("on"); }, { passive: true });
    document.addEventListener("mouseover", function (e) { $("#cursor").classList.toggle("big", !!e.target.closest("a,button,.card,.chip")); });
  }

  /* ---------- intro (once per session, skippable, < 1.6s) ---------- */
  function endIntro() { var i = $("#intro"); if (i.hidden) return; i.classList.add("lift"); document.body.classList.remove("is-loading"); document.body.classList.add("is-ready"); setTimeout(function () { i.hidden = true; }, 950); }
  function initIntro() {
    var i = $("#intro");
    if (reduce || sGet("emy.intro", sessionStorage)) { i.hidden = true; document.body.classList.remove("is-loading"); setTimeout(function () { document.body.classList.add("is-ready"); }, 30); return; }
    sSet("emy.intro", "1", sessionStorage); $("#introSkip").onclick = endIntro; i.addEventListener("click", endIntro); setTimeout(endIntro, 1550);
  }

  /* ---------- 3D logo (story) ---------- */
  function init3D() {
    var box = $("#logo3d"); if (!box) return; var wrap = box.parentElement, tgt = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, live = false, raf = 0;
    function frame() { cur.x += (tgt.x - cur.x) * .09; cur.y += (tgt.y - cur.y) * .09;
      box.style.transform = "rotateY(" + (cur.x * 22).toFixed(2) + "deg) rotateX(" + (-cur.y * 18).toFixed(2) + "deg)";
      box.style.setProperty("--gx", (50 + cur.x * 40) + "%"); box.style.setProperty("--gy", (50 + cur.y * 40) + "%");
      var idle = !live ? Math.sin(Date.now() / 1400) : 0;
      if (!live && !reduce) { tgt.x = Math.sin(Date.now() / 2400) * .35; tgt.y = Math.cos(Date.now() / 2900) * .25; }
      raf = requestAnimationFrame(frame); }
    function move(e) { var r = wrap.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width - .5) * 2, y = ((e.clientY - r.top) / r.height - .5) * 2; tgt.x = Math.max(-1, Math.min(1, x)); tgt.y = Math.max(-1, Math.min(1, y)); live = true; }
    function leave() { live = false; }
    if (reduce) { box.style.transform = "none"; return; }
    wrap.addEventListener("pointermove", move); wrap.addEventListener("pointerleave", leave); wrap.addEventListener("pointerup", leave);
    window.addEventListener("mousemove", function (e) { var r = wrap.getBoundingClientRect(); if (e.clientY > r.top - 300 && e.clientY < r.bottom + 300) move(e); else leave(); }, { passive: true });
    new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { if (!raf) frame(); } else { cancelAnimationFrame(raf); raf = 0; } }); }).observe(wrap);
  }

  /* ---------- assistant (answers only from the site data; says so when it does not know) ---------- */
  var ai = { open: false, started: false };
  function norm(x) { return String(x || "").toLowerCase().replace(/[\u064B-\u0652\u0640]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim(); }
  function kb() {
    var t = tr(), ar = state.lang === "ar", out = [];
    out.push({ k: "order how buy cart اطلب طلب اطلب ازاي شراء سله", a: ar ? "اختار الشموع وضيفها لسلة الطلب، وبعدين كمّل الطلب وادخل بياناتك. هنفتحلك رسالة واتساب جاهزة فيها الطلب." : "Pick your candles, add them to your order, then continue and enter your details. A ready WhatsApp message with your order opens." });
    out.push({ k: "pay payment instapay vodafone cash دفع الدفع انستا باي فودافون كاش تحويل", a: ar ? "الدفع بعد تأكيد الطلب على واتساب، عن طريق إنستا باي أو فودافون كاش، وبتبعت لقطة شاشة التحويل. " + (SITE.INSTAPAY || SITE.VODAFONE_CASH ? "" : "(أرقام التحويل لسه TBD.)") : "You pay after the order is confirmed on WhatsApp, with InstaPay or Vodafone Cash, and send the transfer screenshot. " + (SITE.INSTAPAY || SITE.VODAFONE_CASH ? "" : "(The transfer details are still TBD.)") });
    out.push({ k: "custom name letters eman name شمعه بالاسم اسم حروف", a: t.custom.text + (ar ? " تقدر تبعت الطلب من قسم شموع بالاسم." : " You can send the request from the Custom Names section.") });
    out.push({ k: "delivery shipping توصيل شحن مصاريف مواعيد", a: ar ? "مناطق التوصيل والمصاريف والمواعيد لسه TBD ومش مؤكدة. اسأل على واتساب." : "Delivery areas, fees and timing are still TBD and not confirmed. Please ask on WhatsApp." });
    out.push({ k: "return refund policy استرجاع ارجاع", a: ar ? "سياسة الاسترجاع لسه TBD." : "The returns policy is still TBD." });
    out.push({ k: "contact whatsapp instagram facebook تواصل واتساب انستجرام فيسبوك رقم", a: ar ? "تقدر تكلمنا على واتساب أو إنستجرام أو فيسبوك من قسم تواصل معانا." : "You can reach us on WhatsApp, Instagram or Facebook from the Contact section." });
    out.push({ k: "handmade made how artisan يدوي صناعه", a: ar ? "كل شمعة هاند ميد من أولها لآخرها، وصاحبة البراند إيمي، أم مصرية، بتصنعها بنفسها وبشغف." : "Every candle is handmade from start to finish by Emy, an Egyptian mother, with passion." });
    out.push({ k: "price cost how much سعر بكام كام تمن", a: ar ? "الأسعار لسه TBD لحد ما تتأكد. السعر بيظهر على كارت الشمعة لما يتحط، ولو مش ظاهر اسأل على واتساب." : "Prices are still TBD. The price appears on each candle card once it is set; if it isn't shown, ask on WhatsApp." });
    P.forEach(function (p) {
      var facts = [p.scent && ((ar ? "الريحة: " : "Scent: ") + p.scent), p.weight && ((ar ? "الوزن: " : "Weight: ") + p.weight), p.burn && ((ar ? "مدة الاشتعال: " : "Burn time: ") + p.burn), (ar ? "السعر: " : "Price: ") + priceText(p)].filter(Boolean).join(" · ");
      out.push({ k: p.name.en + " " + p.name.ar + " " + p.slug.replace(/-/g, " "), a: nm(p) + ": " + p.story[state.lang] + " (" + facts + ")", open: p.slug });
    });
    return out;
  }
  function answer(q) {
    var qs = norm(q).split(" ").filter(function (w) { return w.length > 1; }), best = null, bs = 0;
    kb().forEach(function (e) { var ks = norm(e.k).split(" "), sc = 0; qs.forEach(function (w) { if (ks.some(function (k) { return k === w || (w.length > 3 && (k.indexOf(w) === 0 || w.indexOf(k) === 0) && k.length > 3); })) sc += w.length > 3 ? 2 : 1; }); if (sc > bs) { bs = sc; best = e; } });
    return bs >= 2 ? best : null;
  }
  function aiAdd(who, html) { var l = $("#aiLog"), d = document.createElement("div"); d.className = "ai-msg " + who; d.innerHTML = html; l.appendChild(d); l.scrollTop = l.scrollHeight; if (!reduce) d.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: "ease-out" }); }
  function aiAsk(q) {
    if (!q.trim()) return; aiAdd("me", esc(q)); var r = answer(q), t = tr().ai;
    setTimeout(function () {
      if (r) aiAdd("bot", esc(r.a) + (r.open ? ' <button type="button" class="ai-link" data-open="' + r.open + '">' + esc(tr().card.view) + "</button>" : ""));
      else aiAdd("bot", esc(t.fb) + ' <a class="ai-link" target="_blank" rel="noopener" href="' + waLink(q) + '">' + esc(t.ask) + "</a>");
    }, reduce ? 0 : 420);
  }
  function aiRefresh() {
    var t = tr().ai; $("#aiTitle").textContent = t.title; $("#aiSub").textContent = t.sub; $("#aiInput").placeholder = t.ph; $("#aiBtn").setAttribute("aria-label", t.title);
    $("#aiChips").innerHTML = t.chips.map(function (c) { return '<button type="button" class="ai-chip">' + esc(c) + "</button>"; }).join("");
    if (!ai.started) { ai.started = true; aiAdd("bot", esc(t.hello)); }
  }
  function initAI() {
    var btn = $("#aiBtn"), panel = $("#aiPanel");
    function toggle(o) { ai.open = o; btn.setAttribute("aria-expanded", o); if (o) { panel.hidden = false; requestAnimationFrame(function () { panel.classList.add("show"); }); setTimeout(function () { $("#aiInput").focus(); }, 200); } else { panel.classList.remove("show"); setTimeout(function () { panel.hidden = true; }, 300); } }
    btn.onclick = function () { toggle(!ai.open); }; $("#aiClose").onclick = function () { toggle(false); };
    $("#aiForm").addEventListener("submit", function (e) { e.preventDefault(); var i = $("#aiInput"), v = i.value; i.value = ""; aiAsk(v); });
    $("#aiChips").addEventListener("click", function (e) { var c = e.target.closest(".ai-chip"); if (c) aiAsk(c.textContent); });
    $("#aiLog").addEventListener("click", function (e) { var o = e.target.closest("[data-open]"); if (o) { toggle(false); openDetail(o.dataset.open); } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && ai.open) toggle(false); });
  }

  /* ---------- boot ---------- */
  function boot() {
    loadCart(); var saved = sGet("emy.lang"); state.lang = saved === "en" ? "en" : "ar";
    $("#year").textContent = new Date().getFullYear(); bindCustom(); initAI(); applyLang(false); init3D(); initReveal(); initDesktopFx(); initHero3D(); initIntro();
    var m = location.hash.match(/^#\/candle\/([\w-]+)/); if (m && find(m[1])) openDetail(m[1], false);
  }
  boot();
})();
