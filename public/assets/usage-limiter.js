/**
 * ToolMint Usage Limiter
 * ─────────────────────
 * Guests: 5 free tool uses per day (localStorage & cookie-persisted).
 * Authenticated users: unlimited uses.
 */
(() => {
  const MAX_FREE_USES = 5;
  const STORAGE_COUNT = "tm_usage_count";
  const STORAGE_DATE = "tm_usage_date";

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 864e5);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function getUsageCount() {
    const storedDate = localStorage.getItem(STORAGE_DATE) || getCookie(STORAGE_DATE);
    if (storedDate !== todayISO()) {
      localStorage.setItem(STORAGE_COUNT, "0");
      localStorage.setItem(STORAGE_DATE, todayISO());
      setCookie(STORAGE_COUNT, "0", 1);
      setCookie(STORAGE_DATE, todayISO(), 1);
      return 0;
    }
    const val = localStorage.getItem(STORAGE_COUNT) || getCookie(STORAGE_COUNT) || "0";
    return parseInt(val, 10);
  }

  function incrementUsage() {
    const count = getUsageCount() + 1;
    localStorage.setItem(STORAGE_COUNT, String(count));
    localStorage.setItem(STORAGE_DATE, todayISO());
    setCookie(STORAGE_COUNT, String(count), 1);
    setCookie(STORAGE_DATE, todayISO(), 1);
    return count;
  }

  function isSignedIn() {
    return !!(window.ToolMintAuth && window.ToolMintAuth.session);
  }

  function remaining() {
    if (isSignedIn()) return Infinity;
    return Math.max(0, MAX_FREE_USES - getUsageCount());
  }

  function createLimitBanner() {
    if (document.getElementById("usage-limit-banner")) return;
    const banner = document.createElement("div");
    banner.id = "usage-limit-banner";
    banner.className = "usage-limit-banner";
    banner.innerHTML = `
      <div class="usage-limit-overlay"></div>
      <div class="usage-limit-card" role="alert">
        <button class="usage-limit-close" type="button" aria-label="Close">×</button>
        <div class="usage-limit-icon">🔒</div>
        <h3>Daily Free Limit Reached</h3>
        <p>You've used all <strong>${MAX_FREE_USES} free daily tool attempts</strong>. Sign in or create a free account to unlock <strong>unlimited access</strong> to all 72 tools!</p>
        <div class="usage-limit-actions" style="display:flex; flex-direction:column; gap:0.65rem;">
          <button class="btn btn-primary usage-limit-login" type="button">Log in / Sign up for Unlimited Access</button>
        </div>
        <p class="muted usage-limit-hint" style="margin-top:0.9rem; font-size:0.8rem;">Your free usage counter resets daily at midnight.</p>
      </div>
    `;
    document.body.appendChild(banner);

    banner.querySelector(".usage-limit-close").addEventListener("click", removeLimitBanner);
    banner.querySelector(".usage-limit-overlay").addEventListener("click", removeLimitBanner);

    banner.querySelector(".usage-limit-login").addEventListener("click", () => {
      const authBtn = document.querySelector(".auth-trigger");
      if (authBtn) authBtn.click();
      removeLimitBanner();
    });
  }

  function removeLimitBanner() {
    const banner = document.getElementById("usage-limit-banner");
    if (banner) banner.remove();
  }

  function renderUsageBadge() {
    const existing = document.getElementById("usage-badge");
    if (existing) existing.remove();

    const root = document.querySelector("#tool-root");
    if (!root) return;

    const badge = document.createElement("div");
    badge.id = "usage-badge";
    badge.className = "usage-badge";

    if (isSignedIn()) {
      badge.innerHTML = `<span class="usage-badge-icon">✦</span> <span><strong>Unlimited Uses</strong> (Logged In)</span>`;
      badge.classList.add("usage-badge--pro");
    } else {
      const left = remaining();
      if (left === 0) {
        badge.innerHTML = `<span class="usage-badge-icon">🔒</span> <span><strong>0 of ${MAX_FREE_USES} free uses left today</strong> — <a href="#" class="auth-trigger-link" style="text-decoration:underline; font-weight:700;">Log in for Unlimited</a></span>`;
        badge.classList.add("usage-badge--empty");
      } else {
        badge.innerHTML = `<span class="usage-badge-icon">⚡</span> <span><strong>${left}</strong> of ${MAX_FREE_USES} free uses left today — <a href="#" class="auth-trigger-link" style="text-decoration:underline; font-weight:600;">Log in for Unlimited</a></span>`;
        if (left <= 2) badge.classList.add("usage-badge--warn");
      }

      const link = badge.querySelector(".auth-trigger-link");
      if (link) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const authBtn = document.querySelector(".auth-trigger");
          if (authBtn) authBtn.click();
        });
      }
    }

    const panel = document.querySelector(".tool-panel");
    if (panel) panel.parentNode.insertBefore(badge, panel);
  }

  function gateToolUse() {
    document.addEventListener("click", (e) => {
      const target = e.target.closest("button, .btn");
      if (!target) return;

      const toolRoot = target.closest("#tool-root");
      if (!toolRoot) return;

      if (
        target.classList.contains("mini-btn") ||
        target.classList.contains("auth-close") ||
        target.classList.contains("search-clear") ||
        target.dataset.noGate === "true"
      ) {
        return;
      }

      if (isSignedIn()) return;

      const left = remaining();
      if (left <= 0) {
        e.stopImmediatePropagation();
        e.preventDefault();
        createLimitBanner();
        return;
      }

      incrementUsage();
      renderUsageBadge();

      if (remaining() === 0) {
        setTimeout(() => {
          createLimitBanner();
        }, 350);
      }
    }, true);
  }

  function onAuthChange() {
    renderUsageBadge();
    if (isSignedIn()) {
      removeLimitBanner();
    }
  }

  function init() {
    renderUsageBadge();
    gateToolUse();

    window.addEventListener("toolmint:authchange", onAuthChange);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
