/**
 * ToolMint Usage Limiter
 * ─────────────────────
 * Guests:  5 free tool uses per day (cookie-persisted, survives reloads).
 * Signed-in users:  unlimited.
 *
 * Cookies used:
 *   tm_usage_count  – number of tool uses consumed today
 *   tm_usage_date   – ISO date string to reset counter daily
 */
(() => {
  const MAX_FREE_USES = 5;
  const COOKIE_COUNT = "tm_usage_count";
  const COOKIE_DATE = "tm_usage_date";
  const COOKIE_DAYS = 1; // expires after 1 day

  /* ── Cookie helpers ─────────────────────────── */
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 864e5);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  }

  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(?:^|; )" + name + "=([^;]*)"),
    );
    return match ? decodeURIComponent(match[1]) : null;
  }

  /* ── Usage counter ──────────────────────────── */
  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function getUsageCount() {
    const storedDate = getCookie(COOKIE_DATE);
    if (storedDate !== todayISO()) {
      // New day → reset
      setCookie(COOKIE_COUNT, "0", COOKIE_DAYS);
      setCookie(COOKIE_DATE, todayISO(), COOKIE_DAYS);
      return 0;
    }
    return parseInt(getCookie(COOKIE_COUNT) || "0", 10);
  }

  function incrementUsage() {
    const count = getUsageCount() + 1;
    setCookie(COOKIE_COUNT, String(count), COOKIE_DAYS);
    setCookie(COOKIE_DATE, todayISO(), COOKIE_DAYS);
    return count;
  }

  /* ── Auth check ─────────────────────────────── */
  function isSignedIn() {
    return !!(window.ToolMintAuth && window.ToolMintAuth.session);
  }

  /* ── Remaining uses ─────────────────────────── */
  function remaining() {
    if (isSignedIn()) return Infinity;
    return Math.max(0, MAX_FREE_USES - getUsageCount());
  }

  /* ── Limit banner / overlay ─────────────────── */
  function createLimitBanner() {
    if (document.getElementById("usage-limit-banner")) return;
    const banner = document.createElement("div");
    banner.id = "usage-limit-banner";
    banner.className = "usage-limit-banner";
    banner.innerHTML = `
      <div class="usage-limit-overlay"></div>
      <div class="usage-limit-card" role="alert">
        <div class="usage-limit-icon">🔒</div>
        <h3>Daily limit reached</h3>
        <p>You've used all <strong>${MAX_FREE_USES} free tool uses</strong> for today.
          Sign in for <strong>unlimited access</strong> to every tool — it's free!</p>
        <div class="usage-limit-actions">
          <button class="btn btn-primary usage-limit-login" type="button">Sign in to continue</button>
        </div>
        <p class="muted usage-limit-hint">Your limit resets every day at midnight.</p>
      </div>
    `;
    document.body.appendChild(banner);

    banner.querySelector(".usage-limit-login").addEventListener("click", () => {
      // Trigger the auth modal from auth.js
      const authBtn = document.querySelector(".auth-trigger");
      if (authBtn) authBtn.click();
      removeLimitBanner();
    });
    banner
      .querySelector(".usage-limit-overlay")
      .addEventListener("click", () => {
        // Don't close — keep it locked
      });
  }

  function removeLimitBanner() {
    const banner = document.getElementById("usage-limit-banner");
    if (banner) banner.remove();
  }

  /* ── Usage counter badge on tool page ───────── */
  function renderUsageBadge() {
    const existing = document.getElementById("usage-badge");
    if (existing) existing.remove();

    // Only show on tool pages (pages with #tool-root)
    if (!document.querySelector("#tool-root")) return;

    const badge = document.createElement("div");
    badge.id = "usage-badge";
    badge.className = "usage-badge";

    if (isSignedIn()) {
      badge.innerHTML = `<span class="usage-badge-icon">✦</span> <span>Unlimited uses</span>`;
      badge.classList.add("usage-badge--pro");
    } else {
      const left = remaining();
      badge.innerHTML = `<span class="usage-badge-icon">⚡</span> <span><strong>${left}</strong> of ${MAX_FREE_USES} free uses left today</span>`;
      if (left <= 2) badge.classList.add("usage-badge--warn");
      if (left === 0) badge.classList.add("usage-badge--empty");
    }

    // Insert before the tool-panel
    const panel = document.querySelector(".tool-panel");
    if (panel) panel.parentNode.insertBefore(badge, panel);
  }

  /* ── Gate: intercept "Run" buttons ──────────── */
  function gateToolUse() {
    const root = document.getElementById("tool-root");
    if (!root) return;

    // Observe for dynamically rendered buttons
    const observer = new MutationObserver(() => {
      attachGates(root);
    });
    observer.observe(root, { childList: true, subtree: true });

    // Also attach immediately in case render already happened
    attachGates(root);
  }

  function attachGates(root) {
    // Find all "Run" / action buttons that trigger a tool computation
    const buttons = root.querySelectorAll(
      "[data-run], [data-convert], [data-generate]",
    );
    buttons.forEach((btn) => {
      if (btn.dataset.usageGated) return; // already gated
      btn.dataset.usageGated = "true";

      const originalListeners = [];

      // We need to intercept the click. We clone to remove existing listeners,
      // then re-add our gated version. But since listeners were added via
      // addEventListener, we use a capture-phase listener instead.
      btn.addEventListener(
        "click",
        (e) => {
          if (isSignedIn()) return; // signed in → allow everything

          const left = remaining();
          if (left <= 0) {
            e.stopImmediatePropagation();
            e.preventDefault();
            createLimitBanner();
            return;
          }

          // Allow this use + increment
          incrementUsage();
          renderUsageBadge();

          // Check if this was the last free use
          if (remaining() <= 0) {
            // Will show banner on next attempt
          }
        },
        true, // capture phase — runs before app.js listeners
      );
    });
  }

  /* ── Listen for auth state changes ──────────── */
  function onAuthChange() {
    renderUsageBadge();
    if (isSignedIn()) {
      removeLimitBanner();
    }
  }

  /* ── Init ────────────────────────────────────── */
  function init() {
    renderUsageBadge();
    gateToolUse();

    // Watch for auth changes (ToolMintAuth fires a custom event)
    window.addEventListener("toolmint:authchange", onAuthChange);

    // Also poll briefly in case auth loads after us
    let checks = 0;
    const interval = setInterval(() => {
      checks++;
      renderUsageBadge();
      if (isSignedIn()) {
        removeLimitBanner();
        clearInterval(interval);
      }
      if (checks > 20) clearInterval(interval);
    }, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
