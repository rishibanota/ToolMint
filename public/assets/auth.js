(() => {
  const config = window.SITE_CONFIG || {};
  const load = (src) => new Promise((resolve, reject) => { const s = document.createElement('script'); s.src = src; s.onload = resolve; s.onerror = reject; document.head.appendChild(s); });
  const esc = (v) => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function init() {
    if (!config.supabase_url || !config.supabase_anon_key) return;
    try { await load('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'); } catch { return; }
    const client = window.supabase.createClient(config.supabase_url, config.supabase_anon_key);
    const header = document.querySelector('.header-inner'); if (!header) return;
    const actions = document.createElement('div'); actions.className = 'auth-actions';
    actions.innerHTML = '<button class="btn btn-secondary auth-trigger" type="button">Log in</button>';
    header.appendChild(actions);
    const modal = document.createElement('div'); modal.className='auth-modal'; modal.hidden=true;
    modal.innerHTML = `<div class="auth-backdrop"></div><section class="auth-box" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button class="auth-close" type="button" aria-label="Close">×</button><h2 id="auth-title">Welcome to ToolMint</h2><p class="muted auth-subtitle">Create an account or log in to continue.</p><form class="auth-form"><label>Email<input name="email" type="email" required autocomplete="email"></label><label>Password<input name="password" type="password" required minlength="6" autocomplete="current-password"></label><button class="btn btn-primary" type="submit">Log in</button></form><button class="auth-switch" type="button">New here? Create an account</button><p class="auth-message" role="status"></p></section>`;
    document.body.appendChild(modal);
    let signup=false; const title=modal.querySelector('#auth-title'), form=modal.querySelector('form'), submit=form.querySelector('button'), sw=modal.querySelector('.auth-switch'), msg=modal.querySelector('.auth-message');
    const open=()=>{modal.hidden=false; form.email.focus()}; const close=()=>{modal.hidden=true; msg.textContent=''};
    actions.querySelector('button').onclick=open; modal.querySelector('.auth-close').onclick=close; modal.querySelector('.auth-backdrop').onclick=close;
    sw.onclick=()=>{ signup=!signup; title.textContent=signup?'Create your ToolMint account':'Welcome to ToolMint'; submit.textContent=signup?'Sign up':'Log in'; sw.textContent=signup?'Already have an account? Log in':'New here? Create an account'; };
    form.onsubmit=async e=>{e.preventDefault(); msg.textContent='Working…'; const email=form.email.value.trim(), password=form.password.value; const result=signup ? await client.auth.signUp({email,password}) : await client.auth.signInWithPassword({email,password}); if(result.error){msg.textContent=result.error.message; return;} msg.textContent=signup?'Check your email to confirm your account.':'Logged in successfully.'; if(!signup)setTimeout(close,700);};
    const update=({session})=>{ actions.innerHTML=session ? `<span class="auth-user">${esc(session.user.email)}</span><button class="btn btn-secondary auth-logout" type="button">Log out</button>` : '<button class="btn btn-secondary auth-trigger" type="button">Log in</button>'; const b=actions.querySelector('.auth-trigger'); if(b)b.onclick=open; const l=actions.querySelector('.auth-logout'); if(l)l.onclick=()=>client.auth.signOut(); };
    const {data}=await client.auth.getSession(); update({session:data.session}); client.auth.onAuthStateChange((_e,session)=>update({session}));
  }
  document.addEventListener('DOMContentLoaded', init);
})();
