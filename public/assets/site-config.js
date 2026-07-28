/* ============================================================
   ToolMint — /assets/site-config.js
   Your existing config + Adsterra, wired with your real unit keys.
   ============================================================ */
window.SITE_CONFIG = {
  site_name: "ToolMint",

  base_url: "https://toolmint.rishibanota.workers.dev",
  support_email: "rishibanota837@gmail.com",

  // Legacy AdSense fields — inert, kept so old code doesn't break.
  adsense_client: "",
  enable_auto_ads: false,
  enable_manual_placeholders: true,

  brand_color: "#6d5efc",

  supabase_url: "https://clukvudfvuydfinqnano.supabase.co",
  supabase_anon_key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdWt2dWRmdnV5ZGZpbnFuYW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMzQ5NjYsImV4cCI6MjEwMDcxMDk2Nn0.-LT8IWesJ27TlYPVCzHZgkhlDwfx7bMs5eNV_Sp1y7s",

  /* =========================================================
     ADSTERRA
     Strategy: few ads, high value. Native Banner + one display
     banner, hard-capped at 2 per page. Popunder deliberately off.
     ========================================================= */
  adsterra: {
    // Master switch. Set true when you're ready to go live.
    enabled: true,

    // Never show more than this many in-page ads, regardless of how
    // many .ad-card slots exist. Social Bar is not counted (it's an
    // overlay, not a slot).
    max_ads_per_page: 2,

    /* ---- Native Banner ----------------------------------
       Your highest-CPM in-page format. Looks like a content
       card, so it earns well without feeling like an ad.
       Only one per page — the container id is fixed.
    ------------------------------------------------------ */
    native: {
      enabled: true,
      src: "https://pl30571726.effectivecpmnetwork.com/37ffbbf3b67ce54161fc6eceacd3652d/invoke.js",
      container_id: "container-37ffbbf3b67ce54161fc6eceacd3652d",
      min_height: 250, // reserve space to prevent layout shift
    },

    // When a slot says "auto", prefer Native over a display banner.
    prefer_native: true,

    /* ---- Display banners --------------------------------
       `weight` = advertiser demand, NOT pixel size. Higher wins
       when several units fit. 300x250 and 728x90 are the two
       most-bought display sizes on the open market; thin strips
       attract far fewer bidders.

       Only three are enabled. The other three are included so
       you can A/B test later without hunting for keys.
    ------------------------------------------------------ */
    units: {
      // --- ACTIVE ---
      rectangle: {
        key: "5a69722316cbf47bcc3e632666f9ecd8",
        width: 300, height: 250, weight: 100,
      },
      leaderboard: {
        key: "56b14f232eb74ee79656dfae9984033a",
        width: 728, height: 90, weight: 90,
      },
      mobile: {
        key: "fafe0a86e7558ade97c10a6b902e39b0",
        width: 320, height: 50, weight: 60,
      },

      // --- AVAILABLE, OFF BY DEFAULT ---
      // 160x600 skyscraper: only fits a wide sidebar; yours is ~300px.
      skyscraper: {
        key: "e4411e105a293b68b714206708f1c28a",
        width: 160, height: 600, weight: 55, enabled: false,
      },
      // 160x300: low demand, awkward size.
      halfcolumn: {
        key: "e479259fc4d8bd12b219777966c99f63",
        width: 160, height: 300, weight: 30, enabled: false,
      },
      // 468x60: legacy size, weakest demand of the set.
      banner468: {
        key: "54265ad49ee58ccda1a3ad2a3ea749b2",
        width: 468, height: 60, weight: 35, enabled: false,
      },
    },

    /* ---- Slot routing -----------------------------------
       Maps the data-ad-slot values already in your HTML to a
       unit name. "auto" = pick the best available.
    ------------------------------------------------------ */
    slot_map: {
      "content-inline": "auto", // the slot on all 27 /tools/ pages
    },

    /* ---- Social Bar -------------------------------------
       Highest CPM of everything you have, and it costs zero
       layout space. Doesn't count toward max_ads_per_page.
    ------------------------------------------------------ */
    social_bar:
      "https://pl30571733.effectivecpmnetwork.com/38/d1/9f/38d19fd698a69133f449a042dbb200f5.js",

    /* ---- Popunder — INTENTIONALLY DISABLED ---------------
       Your key, kept for reference:
       https://pl30571725.effectivecpmnetwork.com/e2/f7/0d/e2f70df9f41d0368cee7a440c4d56f98.js

       Pays the most per impression and is the fastest way to
       lose a tools audience. See SETUP.md, "Why popunder is off".
       Paste the URL here only if you accept that trade-off.
    ------------------------------------------------------ */
    popunder: "",

    /* ---- Behaviour ---- */
    lazy: true,             // load an ad only as it approaches the viewport
    lazy_margin: "300px",
    label: "Advertisement",
    fit_to_container: true, // downgrade a unit that would overflow its column

    domain: "www.highperformanceformat.com",
  },
};
