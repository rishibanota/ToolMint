/*!
 * ToolMint — Adsterra loader
 * Cloudflare Workers friendly. No build step, no dependencies.
 *
 * Handles three DIFFERENT Adsterra architectures, because they are not
 * interchangeable:
 *
 *  1. DISPLAY BANNERS (highperformanceformat.com)
 *     Configured through a GLOBAL `atOptions` object and injected wherever the
 *     script tag sits. Two banners on one page = the second overwrites the
 *     first's config and one silently dies. invoke.js also calls
 *     document.write(), which wipes the whole DOM if run after page load.
 *     -> Each banner is rendered inside its own srcdoc iframe.
 *
 *  2. NATIVE BANNER (pl30571726.effectivecpmnetwork.com)
 *     Async, no atOptions, and it looks for a specific
 *     <div id="container-<key>"> in the LIVE page. An iframe would hide that
 *     div from it, so this one must run in the main document.
 *     -> Container div is created first, then the script is injected.
 *     -> The container id is fixed, so only ONE native unit per page.
 *
 *  3. PAGE-LEVEL (Social Bar / Popunder)
 *     Self-injecting overlays. One tag per page, consume no layout space.
 *
 * Load order: site-config.js -> app.js -> ads.js
 */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var A = CFG.adsterra || {};

  if (A.enabled !== true) return;

  var UNITS = A.units || {};
  var SLOT_MAP = A.slot_map || {};
  var NATIVE = A.native || {};
  var LAZY = A.lazy !== false;
  var LAZY_MARGIN = A.lazy_margin || "300px";
  var LABEL = A.label === "" ? "" : A.label || "Advertisement";
  var FIT = A.fit_to_container !== false;
  var MAX_ADS = typeof A.max_ads_per_page === "number" ? A.max_ads_per_page : 2;

  var filledCount = 0;
  var nativeUsed = false;

  /* ================================================================
   * Unit pool
   * ============================================================== */
  function buildPool() {
    return Object.keys(UNITS)
      .map(function (name) {
        var u = UNITS[name];
        if (!u || u.enabled === false) return null;
        if (!u.key || /^PASTE_|^DEMO_/.test(u.key)) return null;
        return {
          name: name,
          key: u.key,
          width: Number(u.width) || 0,
          height: Number(u.height) || 0,
          // Advertiser demand, not pixel area. 300x250 and 728x90 attract the
          // most bids; thin strips like 320x50 and 468x60 attract the least.
          weight: typeof u.weight === "number" ? u.weight : 50,
          host: u.domain || A.domain || "www.highperformanceformat.com",
        };
      })
      .filter(Boolean);
  }

  var POOL = buildPool();

  function nativeReady() {
    return !!(
      NATIVE.enabled !== false &&
      NATIVE.src &&
      NATIVE.container_id &&
      !/PASTE_|DEMO_/.test(NATIVE.src)
    );
  }

  function availableWidth(slot) {
    var w = slot.clientWidth;
    if (!w && slot.parentElement) w = slot.parentElement.clientWidth;
    return w || window.innerWidth || 0;
  }

  function fitting(avail) {
    return POOL.filter(function (u) { return u.width <= avail; });
  }

  function narrowest() {
    return POOL.slice().sort(function (a, b) { return a.width - b.width; })[0] || null;
  }

  /** Highest-earning unit that fits, ranked by advertiser demand. */
  function bestByValue(slot) {
    var c = fitting(availableWidth(slot));
    if (!c.length) return narrowest();
    return c.sort(function (a, b) {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return b.width * b.height - a.width * a.height;
    })[0];
  }

  /**
   * A requested unit that overflows gets downgraded to the widest unit that
   * fits — someone asking for a 728x90 wants a wide banner, not a tall box.
   */
  function bestByWidth(slot) {
    var c = fitting(availableWidth(slot));
    if (!c.length) return narrowest();
    return c.sort(function (a, b) { return b.width - a.width; })[0];
  }

  /**
   * Decides what a slot should show.
   * Returns {type:"native"} | {type:"banner", unit} | null
   */
  function resolve(slot) {
    var want =
      slot.getAttribute("data-ad") ||
      SLOT_MAP[slot.getAttribute("data-ad-slot")] ||
      "auto";

    if (want === "native") {
      if (nativeReady() && !nativeUsed) return { type: "native" };
      // Native already placed (or unconfigured) — fall back to a banner.
      var fb = bestByValue(slot);
      return fb ? { type: "banner", unit: fb } : null;
    }

    if (want === "auto") {
      if (nativeReady() && !nativeUsed && A.prefer_native !== false) {
        return { type: "native" };
      }
      var best = bestByValue(slot);
      return best ? { type: "banner", unit: best } : null;
    }

    var named = null;
    for (var i = 0; i < POOL.length; i++) {
      if (POOL[i].name === want) { named = POOL[i]; break; }
    }
    if (!named) {
      var alt = bestByValue(slot);
      return alt ? { type: "banner", unit: alt } : null;
    }
    if (FIT && named.width > availableWidth(slot)) {
      var dg = bestByWidth(slot);
      return dg ? { type: "banner", unit: dg } : null;
    }
    return { type: "banner", unit: named };
  }

  /* ================================================================
   * Rendering
   * ============================================================== */
  function addLabel(slot) {
    if (!LABEL || slot.querySelector(".ad-label")) return;
    var t = document.createElement("span");
    t.className = "ad-label";
    t.textContent = LABEL;
    t.style.cssText =
      "display:block;font-size:10px;letter-spacing:.08em;text-transform:uppercase;" +
      "opacity:.45;margin-bottom:6px;text-align:center";
    slot.appendChild(t);
  }

  function bannerDoc(unit) {
    // "<\/script>" escaping is mandatory: an unescaped closing tag inside a JS
    // string would terminate the surrounding <script> block.
    return (
      "<!doctype html><html><head><meta charset='utf-8'>" +
      "<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>" +
      "</head><body>" +
      "<script type='text/javascript'>atOptions=" +
      JSON.stringify({
        key: unit.key,
        format: "iframe",
        height: unit.height,
        width: unit.width,
        params: {},
      }) +
      ";<\/script>" +
      "<script type='text/javascript' src='https://" +
      unit.host + "/" + unit.key + "/invoke.js'><\/script>" +
      "</body></html>"
    );
  }

  function renderBanner(slot, unit) {
    var f = document.createElement("iframe");
    f.width = unit.width;
    f.height = unit.height;
    f.setAttribute("scrolling", "no");
    f.setAttribute("frameborder", "0");
    f.setAttribute("marginwidth", "0");
    f.setAttribute("marginheight", "0");
    f.setAttribute("title", "Advertisement");
    f.setAttribute("aria-label", "Advertisement");
    f.style.cssText =
      "display:block;margin:0 auto;border:0;overflow:hidden;max-width:100%";
    f.srcdoc = bannerDoc(unit);
    slot.appendChild(f);
  }

  function renderNative(slot) {
    // Order matters: the container must exist in the DOM before invoke.js runs,
    // otherwise the script finds nothing and renders nothing.
    var box = document.createElement("div");
    box.id = NATIVE.container_id;
    slot.appendChild(box);

    var s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false"); // survive Cloudflare Rocket Loader
    s.src = NATIVE.src;
    s.id = "adsterra-native";
    slot.appendChild(s);

    nativeUsed = true;
  }

  function fillSlot(slot) {
    if (slot.dataset.adFilled) return;
    if (MAX_ADS > 0 && filledCount >= MAX_ADS) return;

    var plan = resolve(slot);
    if (!plan) return;

    slot.dataset.adFilled = "1";
    filledCount++;

    var ph = slot.querySelector(".ad-placeholder");
    if (ph) ph.remove();

    addLabel(slot);

    if (plan.type === "native") renderNative(slot);
    else renderBanner(slot, plan.unit);
  }

  /* ================================================================
   * Page-level formats
   * ============================================================== */
  function injectPageTag(id, src) {
    if (!src || /PASTE_|DEMO_/.test(src) || document.getElementById(id)) return;
    var s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = src;
    (document.body || document.documentElement).appendChild(s);
  }

  function mountPageTags() {
    injectPageTag("adsterra-social-bar", A.social_bar);
    injectPageTag("adsterra-popunder", A.popunder);
  }

  /* ================================================================
   * Slot discovery + lazy loading
   * ============================================================== */
  function reserve(slot) {
    // Reserve height before the ad arrives so the page never jumps (CLS).
    var plan = resolve(slot);
    if (!plan) return;
    if (plan.type === "native") {
      if (NATIVE.min_height) slot.style.minHeight = NATIVE.min_height + "px";
    } else if (plan.unit.height) {
      slot.style.minHeight = plan.unit.height + "px";
    }
  }

  function scan() {
    var slots = document.querySelectorAll(".ad-card");
    if (!slots.length) return;

    Array.prototype.forEach.call(slots, function (s) {
      if (!s.dataset.adFilled) reserve(s);
    });

    if (!LAZY || typeof IntersectionObserver === "undefined") {
      Array.prototype.forEach.call(slots, fillSlot);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          fillSlot(e.target);
          io.unobserve(e.target);
        });
      },
      { rootMargin: LAZY_MARGIN }
    );

    Array.prototype.forEach.call(slots, function (s) {
      if (!s.dataset.adFilled) io.observe(s);
    });
  }

  function init() {
    var haveInventory = POOL.length || nativeReady();
    if (!haveInventory && !A.social_bar && !A.popunder) return;
    if (haveInventory) document.documentElement.classList.remove("ads-disabled");
    mountPageTags();
    scan();
  }

  window.ToolMintAds = {
    refresh: scan,
    stats: function () {
      return {
        filled: filledCount,
        cap: MAX_ADS,
        nativeUsed: nativeUsed,
        units: POOL.map(function (u) { return u.name; }),
      };
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
