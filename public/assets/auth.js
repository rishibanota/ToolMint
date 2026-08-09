(() => {
  const config = window.SITE_CONFIG || {};
  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      if (window.supabase) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });

  const esc = (v) =>
    String(v).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );

  window.ToolMintAuth = { session: null };

  function setAuthCookie(session) {
    if (session) {
      const d = new Date();
      d.setTime(d.getTime() + 30 * 864e5);
      document.cookie = `tm_auth=1;expires=${d.toUTCString()};path=/;SameSite=Lax`;
    } else {
      document.cookie =
        "tm_auth=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax";
    }
  }

  function fireAuthEvent() {
    window.dispatchEvent(new CustomEvent("toolmint:authchange"));
  }

  async function init() {
    const header = document.querySelector(".header-inner");
    if (!header) return;

    let actions = document.querySelector(".auth-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "auth-actions";
      header.appendChild(actions);
    }

    const modal = document.createElement("div");
    modal.className = "auth-modal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="auth-backdrop"></div>
      <section class="auth-box" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button class="auth-close" type="button" aria-label="Close">×</button>
        <h2 id="auth-title">Welcome to ToolMint</h2>
        <p class="muted auth-subtitle">Log in or create a free account for unlimited access.</p>
        <form class="auth-form">
          <label>Email Address<input name="email" type="email" required autocomplete="email" placeholder='name@example.com'></label>
          <label>Password<input name="password" type="password" required minlength="6" autocomplete="current-password" placeholder='Enter your password'></label>
          <button class="btn btn-primary" type="submit">Log in</button>
        </form>
        <div style="margin-top:1.2rem; text-align:center;">
          <button class="auth-switch" type="button" style="background:none; border:none; color:var(--primary-2); font-weight:600; cursor:pointer;">New here? Create an account</button>
        </div>
        <p class="auth-message" role="status" style="margin-top:1rem; font-size:0.88rem; text-align:center; font-weight:600;"></p>
      </section>
    `;
    document.body.appendChild(modal);

    let signup = false;
    const title = modal.querySelector("#auth-title"),
      form = modal.querySelector("form"),
      submit = form.querySelector("button[type='submit']"),
      sw = modal.querySelector(".auth-switch"),
      msg = modal.querySelector(".auth-message");

    const open = () => {
      signup = false;
      title.textContent = "Welcome to ToolMint";
      submit.textContent = "Log in";
      sw.textContent = "New here? Create an account";
      msg.textContent = "";
      modal.hidden = false;
      form.email.focus();
    };

    const openSignup = () => {
      signup = true;
      title.textContent = "Create your ToolMint account";
      submit.textContent = "Sign up";
      sw.textContent = "Already have an account? Log in";
      msg.textContent = "";
      modal.hidden = false;
      form.email.focus();
    };

    const close = () => {
      modal.hidden = true;
      msg.textContent = "";
    };

    modal.querySelector(".auth-close").onclick = close;
    modal.querySelector(".auth-backdrop").onclick = close;

    sw.onclick = () => {
      signup = !signup;
      title.textContent = signup
        ? "Create your ToolMint account"
        : "Welcome to ToolMint";
      submit.textContent = signup ? "Sign up" : "Log in";
      sw.textContent = signup
        ? "Already have an account? Log in"
        : "New here? Create an account";
      msg.textContent = "";
    };

    let client = null;
    if (config.supabase_url && config.supabase_anon_key) {
      try {
        await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2");
        client = window.supabase.createClient(
          config.supabase_url,
          config.supabase_anon_key,
        );
      } catch (err) {
        console.error("Auth module initialization error.");
      }
    }

    form.onsubmit = async (e) => {
      e.preventDefault();
      msg.style.color = "var(--text)";
      msg.textContent = "Verifying credentials…";

      const email = form.email.value.trim(),
        password = form.password.value;

      if (!client) {
        msg.style.color = "var(--danger)";
        msg.textContent = "Unable to connect to authentication server. Please try again.";
        return;
      }

      const result = signup
        ? await client.auth.signUp({ email, password })
        : await client.auth.signInWithPassword({ email, password });

      if (result.error) {
        msg.style.color = "var(--danger)";
        msg.textContent = result.error.message;
        return;
      }

      msg.style.color = "var(--success)";
      if (signup) {
        msg.textContent = "Account created! Please check your email to confirm sign up.";
      } else {
        msg.textContent = "Logged in successfully!";
        setTimeout(close, 600);
      }
    };

    function updateUI(session) {
      window.ToolMintAuth.session = session;
      setAuthCookie(session);
      fireAuthEvent();

      if (session && session.user) {
        actions.innerHTML = `<span class="auth-user" title="${esc(session.user.email)}">👤 ${esc(session.user.email)}</span><button class="btn btn-secondary auth-logout" type="button">Log out</button>`;
        const l = actions.querySelector(".auth-logout");
        if (l) {
          l.onclick = async () => {
            if (client) await client.auth.signOut();
            updateUI(null);
          };
        }
      } else {
        actions.innerHTML = '<button class="btn btn-secondary auth-trigger" type="button">Log in</button><button class="btn btn-primary auth-signup-trigger" type="button">Sign up</button>';
        const b = actions.querySelector(".auth-trigger");
        if (b) b.onclick = open;
        const s = actions.querySelector(".auth-signup-trigger");
        if (s) s.onclick = openSignup;
      }
    }

    if (client) {
      const { data } = await client.auth.getSession();
      updateUI(data ? data.session : null);
      client.auth.onAuthStateChange((_e, session) => updateUI(session));
    } else {
      updateUI(null);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
