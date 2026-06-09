// v4 — "Nava-direction" — dark premium agency for Yann Hamonou.

const { useState: useStateV4, useEffect: useEffectV4 } = React;

const V4_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "atmosphere": true
}/*EDITMODE-END*/;

/* ====================================================== */
/* SVG icons                                              */
/* ====================================================== */

function V4Arrow({ size = 14, dir = "up-right" }) {
  const path = {
    "up-right": "M7 17L17 7M9 7h8v8",
    "right":    "M5 12h14M13 5l7 7-7 7",
    "down":     "M12 5v14M5 13l7 7 7-7",
    "left":     "M19 12H5M11 5L4 12l7 7",
  }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {path.split("M").filter(Boolean).map((p, i) => <path key={i} d={"M" + p} />)}
    </svg>
  );
}

function V4Btn({ children, onClick, solid }) {
  return (
    <button className={"v4-btn" + (solid ? " is-solid" : "")} onClick={onClick}>
      <span>{children}</span>
      <span className="arr"><V4Arrow size={11} dir="up-right" /></span>
    </button>
  );
}

function V4SvcIcon({ id }) {
  // Tiny line glyphs that match the agency vibe
  const common = { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    positioning: <svg {...common}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>,
    seo:         <svg {...common}><circle cx="11" cy="11" r="6" /><path d="M16 16l4 4" /><path d="M8 11h6M11 8v6" /></svg>,
    strategy:    <svg {...common}><path d="M3 18l6-7 4 4 7-9" /><circle cx="3" cy="18" r="1.5" fill="currentColor" /><circle cx="20" cy="6" r="1.5" fill="currentColor" /></svg>,
    paid:        <svg {...common}><rect x="3" y="14" width="4" height="7" /><rect x="10" y="9" width="4" height="12" /><rect x="17" y="4" width="4" height="17" /></svg>,
    web:         <svg {...common}><rect x="3" y="4" width="18" height="14" rx="1.5" /><path d="M3 9h18" /><circle cx="7" cy="6.5" r="0.5" fill="currentColor" /></svg>,
    automation:  <svg {...common}><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6h7M6 8.5v7M18 8.5v7M8.5 18h7" /></svg>,
  };
  return icons[id] || icons.strategy;
}

/* ====================================================== */
/* NAV                                                     */
/* ====================================================== */

function V4ThemeToggle({ theme, onToggle }) {
  const isLight = theme === "light";
  return (
    <button
      className="v4-theme-toggle"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      data-light={isLight ? "true" : "false"}
      onClick={onToggle}
    >
      <span className="v4-tt-icon v4-tt-moon" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      </span>
      <span className="v4-tt-knob" aria-hidden="true" />
      <span className="v4-tt-icon v4-tt-sun" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </span>
    </button>
  );
}

function V4Nav({ navigate, route, theme, onToggleTheme }) {
  // On home, smooth-scroll to the section; on any sub-page, route to the
  // dedicated page so the link always lands somewhere real.
  const go = (sectionId, page, slug) => {
    if (route?.page === "home") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate?.({ page, slug });
    }
  };
  const [menuOpen, setMenuOpen] = useStateV4(false);
  // Close the drawer whenever the route changes.
  useEffectV4(() => { setMenuOpen(false); }, [route]);
  const mGo = (fn) => () => { setMenuOpen(false); fn(); };
  return (
    <nav className="v4-nav">
      <div className="wrap v4-nav-inner">
        <button className="v4-nav-brand" onClick={() => navigate?.({ page: "home" })}>
          <span className="dot" />
          <span>Yann.Hamonou</span>
        </button>
        <div className="v4-nav-center">
          <a onClick={() => go("v4-about", "about")}>About</a>
          <a onClick={() => go("v4-services", "content", "strategy")}>Services</a>
          <a onClick={() => go("v4-works", "work")}>Work</a>
          <a onClick={() => navigate?.({ page: "blog" })}>Journal</a>
        </div>
        <div className="v4-nav-right">
          <V4ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button className="v4-nav-icon" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button className="v4-cta" onClick={() => navigate?.({ page: "contact" })}>
            <span className="dot" />
            <span>Contact Me</span>
          </button>
        </div>
      </div>
      <div className={"v4-mobile-menu" + (menuOpen ? " is-open" : "")}>
        <button className="v4-mm-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>×</button>
        <a onClick={mGo(() => go("v4-about", "about"))}>About</a>
        <a onClick={mGo(() => go("v4-services", "content", "strategy"))}>Services</a>
        <a onClick={mGo(() => go("v4-works", "work"))}>Work</a>
        <a onClick={mGo(() => navigate?.({ page: "blog" }))}>Journal</a>
        <a onClick={mGo(() => navigate?.({ page: "contact" }))}>Contact</a>
      </div>
    </nav>
  );
}

/* ====================================================== */
/* HERO                                                    */
/* ====================================================== */

function V4Hero() {
  return (
    <section className="v4-hero">
      <div className="v4-smoke s-1" />
      <div className="v4-smoke s-2" />
      <div className="wrap">
        <div className="v4-hero-top">
          <h1 className="v4-hero-h">
            <span className="line">Marketing</span>
            <span className="line is-indent">
            <span>Consultant</span>
            </span>
            <span className="line">Aberdeen</span>
          </h1>
          <div>
            <p className="v4-hero-sub">
              Sharpening positioning, ranking pages, and shipping campaigns for ambitious B2B teams in Scotland and beyond.
            </p>
          </div>
        </div>

        <div className="v4-hero-bottom">
          <span>Stonehaven · Aberdeenshire · UK</span>
          <button className="v4-hero-scroll" onClick={() => document.getElementById("v4-about")?.scrollIntoView({ behavior: "smooth" })}>
            <span>Scroll Down</span>
            <V4Arrow size={12} dir="down" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ====================================================== */
/* INTRO — "Who I am"                                      */
/* ====================================================== */

function V4Intro({ navigate }) {
  return (
    <section className="v4-section pad-tight" id="v4-about">
      <div className="wrap">
        <div className="v4-row">
          <div className="v4-label">Who I am</div>
          <h2 className="v4-intro-title">
            Sharpening B2B brands<br/>with strategy, SEO, and<br/>marketing that ships.
          </h2>
          <div className="v4-intro-body">
            <p>I'm Yann — twelve years in B2B marketing across SaaS, industrial and professional services. I plan the work and then I do the work: positioning, SEO, paid, web and automation, sold by the day, not the package.</p>
            <V4Btn onClick={() => navigate?.({ page: "about" })}>About Me</V4Btn>
          </div>
        </div>

        <div className="v4-stat-row">
          <div className="v4-stat-card">
            <div className="l">Senior B2B marketing, delivered at the speed of a freelancer — not the cost of an agency.</div>
            <div>
              <div className="v">12<sup>YR</sup></div>
              <div className="vlabel">B2B Experience</div>
            </div>
          </div>
          <div className="v4-stat-img">
            <image-slot
              id="v4-intro-photo"
              shape="rect"
              radius="18"
              placeholder="Drop a photo of yourself, your studio, or a working session"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            ></image-slot>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====================================================== */
/* WORKS                                                   */
/* ====================================================== */

function V4Works({ navigate }) {
  const cases = window.SITE_DATA.cases;
  const railRef = React.useRef(null);
  const scroll = (dir) => {
    if (!railRef.current) return;
    const card = railRef.current.querySelector(".v4-work-card");
    const step = card ? card.offsetWidth + 20 : 400;
    railRef.current.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  // Augment cases with display data
  const items = [
    { ...cases[0], tags: ["Web", "SEO"], hero: "+500%" },
    { ...cases[1], tags: ["Positioning", "Strategy"], hero: "+38%" },
    { slug: "more", client: "Q.Arch", year: "2024", tags: ["Web"], hero: "—", role: "Webflow refresh & messaging" },
    { slug: "more2", client: "Collabrio", year: "2024", tags: ["Strategy"], hero: "—", role: "Coaching practice positioning" },
  ];
  return (
    <section className="v4-section bg-panel-2" id="v4-works">
      <div className="v4-smoke s-3" />
      <div className="wrap">
        <div className="v4-row is-centered">
          <div className="v4-label">Selected work</div>
          <h2 className="v4-intro-title v4-centered-title" style={{ maxWidth: "16ch" }}>
            Work that speaks<br/>louder than slides.
          </h2>
        </div>

        <div className="v4-works-stage" ref={railRef}>
          <div className="v4-works-rail">
            {items.map((c, i) => (
              <div key={c.slug + i} className="v4-work-card">
                <image-slot
                  id={"v4-work-" + c.slug}
                  shape="rect"
                  radius="22"
                  placeholder={"Drop " + c.client + " photo"}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                ></image-slot>
                <div className="v4-work-shade" />
                <div className="v4-work-tags">
                  {c.tags.map(t => <span key={t} className="v4-work-tag">{t}</span>)}
                </div>
                <button className="v4-work-foot" onClick={() => c.slug.length < 12 && navigate?.({ page: "case", slug: c.slug })} aria-label={"View " + c.client + " case study"}>
                  <div>
                    <div className="name">{c.client} — {c.year}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 4, fontFamily: "var(--v4-mono)" }}>{c.role}</div>
                  </div>
                  {c.hero !== "—" && <div className="v4-work-stat">{c.hero}</div>}
                </button>
              </div>
            ))}
          </div>
          <div className="v4-works-ctrls">
            <V4Btn onClick={() => navigate?.({ page: "work" })}>View All</V4Btn>
            <div className="v4-works-note">
              Real numbers from real engagements. Happy to walk you through the underlying analytics on a call.
            </div>
            <div className="v4-arrows">
              <button className="v4-arrow-btn" onClick={() => scroll(-1)} aria-label="Previous"><V4Arrow size={16} dir="left" /></button>
              <button className="v4-arrow-btn" onClick={() => scroll(1)} aria-label="Next"><V4Arrow size={16} dir="right" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====================================================== */
/* SERVICES                                                */
/* ====================================================== */

function V4Services({ navigate }) {
  const all = window.SITE_DATA.services;
  // Pick four core
  const ids = ["positioning", "seo", "strategy", "paid"];
  const services = ids.map(id => all.find(s => s.id === id));
  return (
    <section className="v4-section" id="v4-services">
      <div className="wrap">
        <div className="v4-row is-centered">
          <div className="v4-label">Services I provide</div>
          <h2 className="v4-intro-title v4-centered-title" style={{ maxWidth: "18ch" }}>
            Expert services<br/>to drive growth.
          </h2>
        </div>

        <div className="v4-svc-grid">
          <div className="v4-svc v4-svc-stat">
            <div className="v">£500</div>
            <div className="l">Day rate, all-in</div>
          </div>

          {services.map((s) => (
            <button key={s.id} className="v4-svc" onClick={() => navigate?.({ page: "content", slug: s.id })}>
              <div className="v4-svc-icon"><V4SvcIcon id={s.id} /></div>
              <h3>{s.title}</h3>
              <p>{s.lead}</p>
              <span className="learn">
                Learn More <span className="arr"><V4Arrow size={9} dir="up-right" /></span>
              </span>
            </button>
          ))}

          <div className="v4-svc v4-svc-meta">
            <p className="lead">Every engagement is sized to the problem — and accountable to a number we agree before we start.</p>
            <V4Btn onClick={() => navigate?.({ page: "content", slug: "strategy" })}>View All Services</V4Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====================================================== */
/* PARTNERS                                                */
/* ====================================================== */

function V4Partners() {
  const clients = window.SITE_DATA.clients;
  // Duplicate for infinite-marquee
  const track = [...clients, ...clients, ...clients];
  return (
    <section className="v4-section pad-tight bg-panel-2">
      <div className="wrap">
        <div className="v4-row is-centered">
          <div className="v4-label">Partners</div>
          <h2 className="v4-partner-h v4-centered-title">
            B2B teams that<br/>shipped with me.
          </h2>
        </div>

        <div className="v4-partner-stats">
          <div className="v4-partner-stat">
            <div className="v">12<sup style={{ fontSize: "0.45em", marginLeft: 4, color: "var(--v4-ink-mute)" }}>YR</sup></div>
            <div className="l">B2B Experience</div>
          </div>
          <div className="v4-partner-divider" />
          <div className="v4-partner-stat">
            <div className="v">100%</div>
            <div className="l">Lead-gen lift · Proactis</div>
          </div>
        </div>
      </div>

      <div className="v4-logos-rail" style={{ marginTop: 64 }}>
        <div className="v4-logos-track">
          {track.map((c, i) => (
            <span key={i} className={"v4-logo-item" + (i % 7 === 3 ? " is-active" : "")}>
              <span className="glyph">◆</span>
              <span>{c}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ====================================================== */
/* TESTIMONIALS                                            */
/* ====================================================== */

function V4Testimonials() {
  const ts = window.SITE_DATA.testimonials;
  return (
    <section className="v4-section pad-tight">
      <div className="wrap">
        <div className="v4-row is-centered">
          <div className="v4-label">5.0 / 5 client review</div>
          <h2 className="v4-testi-h v4-centered-title" style={{ maxWidth: "18ch" }}>
            What clients<br/>say about the work.
          </h2>
        </div>

        <div className="v4-testi-grid">
          <div className="v4-testi-stat">
            <div>
              <div className="v">5.00</div>
              <div className="l">Client satisfaction rate</div>
            </div>
            <div style={{ marginTop: 32 }}>
              <div className="v4-nav-brand" style={{ fontSize: 20 }}>
                <span className="dot" />
                <span>Yann.Hamonou</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--v4-ink-mute)", marginTop: 6, whiteSpace: "nowrap" }}>
                Trusted by clients across the UK
              </div>
            </div>
          </div>

          {ts.slice(0, 2).map((t, i) => (
            <div key={i} className="v4-testi-card">
              <div className="v4-testi-meta">
                <div className="v4-testi-avatar">{t.author.split(" ").map(w => w[0]).slice(0, 2).join("")}</div>
                <div className="v4-testi-meta-text">
                  <div className="v4-testi-meta-name">{t.author}</div>
                  <div className="v4-testi-meta-role">{t.role}</div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <div className="v4-testi-stars">★★★★★</div>
                </div>
              </div>
              <p>"{t.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ====================================================== */
/* INSIGHTS                                                */
/* ====================================================== */

function V4Insights({ navigate }) {
  const posts = window.SITE_DATA.posts.slice(0, 3);
  return (
    <section className="v4-section pad-tight bg-panel-2">
      <div className="wrap">
        <div className="v4-row is-centered">
          <div className="v4-label">Insight</div>
          <h2 className="v4-testi-h v4-centered-title" style={{ maxWidth: "18ch" }}>
            Notes from the<br/>marketing trenches.
          </h2>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <p style={{ fontSize: 13.5, color: "var(--v4-ink-mute)", lineHeight: 1.6, maxWidth: "42ch", textAlign: "center" }}>
            Pragmatic notes on SEO, B2B GTM and the boring craft of making marketing actually work.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
          <V4Btn onClick={() => navigate?.({ page: "blog" })}>View All</V4Btn>
        </div>

        <div className="v4-articles">
          {posts.map((p) => (
            <div key={p.slug} className="v4-article">
              <div className="v4-article-img">
                <image-slot
                  id={"v4-art-" + p.slug}
                  shape="rect"
                  radius="0"
                  placeholder={"Drop hero image for: " + p.title.slice(0, 32) + "…"}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                ></image-slot>
                <span className="v4-article-tag">{p.cat}</span>
              </div>
              <button className="v4-article-body" onClick={() => navigate?.({ page: "post", slug: p.slug })}>
                <div className="v4-article-meta">
                  <span>{p.readMin} min read</span>
                  <span>{new Date(p.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
                <h3 className="v4-article-title">{p.title}</h3>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ====================================================== */
/* CLOSER                                                  */
/* ====================================================== */

function V4Closer({ navigate }) {
  return (
    <section className="v4-closer" id="v4-contact">
      <div className="v4-smoke s-1" />
      <div className="v4-smoke s-2" />
      <div className="wrap">
        <h2 className="v4-closer-h">
          <span className="word">Let's</span>
          <span className="word">work</span>
          <button className="v4-closer-arrow" onClick={() => navigate?.({ page: "contact" })} aria-label="Get in touch">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </button>
          <span className="word">together</span>
        </h2>
      </div>
    </section>
  );
}

/* ====================================================== */
/* FOOTER                                                  */
/* ====================================================== */

function V4Footer({ navigate }) {
  return (
    <footer className="v4-footer">
      <div className="v4-smoke s-3" />
      <div className="wrap">
        <div className="v4-footer-cols">
          <div className="v4-footer-brand">
            <div className="b">Yann.Hamonou</div>
            <div className="tag">B2B Marketing Consultant — Aberdeen, Scotland.</div>
            <div className="v4-footer-socials">
              <a className="v4-footer-social" aria-label="LinkedIn" href="https://www.linkedin.com/in/yannhamonou/" target="_blank" rel="noopener noreferrer">in</a>
              <a className="v4-footer-social" aria-label="Email" href="mailto:hello@yannhamonou.com">@</a>
              <a className="v4-footer-social" aria-label="Phone" href="tel:+447853455816">☎</a>
            </div>
          </div>

          <div className="v4-footer-col">
            <h5>Pages</h5>
            <ul>
              <li><a onClick={() => navigate?.({ page: "home" })}>Home</a></li>
              <li><a onClick={() => navigate?.({ page: "about" })}>About</a></li>
              <li><a onClick={() => navigate?.({ page: "content", slug: "strategy" })}>Services</a></li>
              <li><a onClick={() => navigate?.({ page: "work" })}>Work</a></li>
              <li><a onClick={() => navigate?.({ page: "blog" })}>Journal</a></li>
              <li><a onClick={() => navigate?.({ page: "contact" })}>Contact</a></li>
            </ul>
          </div>

          <div className="v4-footer-col">
            <h5>Explore</h5>
            <ul>
              <li><a onClick={() => navigate?.({ page: "aberdeen" })}>Aberdeen Agency</a></li>
              <li><a onClick={() => navigate?.({ page: "content", slug: "seo" })}>SEO &amp; GEO</a></li>
              <li><a onClick={() => navigate?.({ page: "work" })}>Case Studies</a></li>
              <li><a onClick={() => navigate?.({ page: "privacy" })}>Privacy Policy</a></li>
            </ul>
          </div>

          <div className="v4-footer-col">
            <h5>Contact</h5>
            <ul>
              <li className="k">Phone</li>
              <li><a href="tel:+447853455816">+44 (0) 785 3455816</a></li>
              <li className="k">Email</li>
              <li><a href="mailto:hello@yannhamonou.com">hello@yannhamonou.com</a></li>
              <li className="k">Address</li>
              <li>Stonehaven, Aberdeenshire<br/>AB39, United Kingdom</li>
            </ul>
          </div>
        </div>

        <div className="v4-footer-bottom">
          <span>© 2025 Yann Hamonou. All rights reserved.</span>
          <span className="v4-footer-legal">
            <a onClick={() => navigate?.({ page: "privacy" })}>Privacy Policy</a>
            <a onClick={() => navigate?.({ page: "contact" })}>Contact</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ====================================================== */
/* APP                                                     */
/* ====================================================== */

function V4Home({ navigate }) {
  return (
    <React.Fragment>
      <V4Hero />
      <V4Intro navigate={navigate} />
      <V4Works navigate={navigate} />
      <V4Services navigate={navigate} />
      <V4Partners />
      <V4Testimonials />
      <V4Insights navigate={navigate} />
      <V4Closer navigate={navigate} />
    </React.Fragment>
  );
}

function V4App() {
  const [t, setTweak] = useTweaks(V4_TWEAK_DEFAULTS);
  const [route, setRoute] = useStateV4({ page: "home" });

  // Theme is plain, self-contained state (decoupled from the tweak panel's
  // persistence) so the visitor toggle is the single source of truth and
  // the <body> class can never drift out of sync with the switch.
  const [theme, setTheme] = useStateV4(() => {
    try { return localStorage.getItem("v4-theme") || "dark"; } catch (e) { return "dark"; }
  });
  const [paper, setPaper] = useStateV4(() => {
    try { return localStorage.getItem("v4-paper") || "cool"; } catch (e) { return "cool"; }
  });

  const navigate = (r) => {
    setRoute(r);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  };

  // Visitor-facing theme switch: dark ⇄ light.
  const toggleTheme = () => setTheme((p) => (p === "light" ? "dark" : "light"));

  // Apply theme to <body> (so every section + html background follows) and persist.
  useEffectV4(() => {
    const b = document.body;
    b.classList.toggle("is-light", theme === "light");
    b.classList.remove("tone-warm", "tone-cool", "tone-bright");
    if (theme === "light") b.classList.add("tone-" + (paper || "cool"));
    try {
      localStorage.setItem("v4-theme", theme);
      localStorage.setItem("v4-paper", paper);
    } catch (e) {}
  }, [theme, paper]);

  // Atmosphere stays a designer tweak.
  useEffectV4(() => {
    document.body.classList.toggle("no-smoke", !t.atmosphere);
  }, [t.atmosphere]);

  let body;
  switch (route.page) {
    case "home":    body = <V4Home navigate={navigate} />; break;
    case "content": body = <ContentPage slug={route.slug || "strategy"} navigate={navigate} />; break;
    case "work":    body = <WorkIndex navigate={navigate} />; break;
    case "case":    body = <CaseStudyPage slug={route.slug || "arnlea"} navigate={navigate} />; break;
    case "blog":    body = <BlogPage navigate={navigate} />; break;
    case "post":    body = <BlogPost slug={route.slug} navigate={navigate} />; break;
    case "about":   body = <AboutPage navigate={navigate} />; break;
    case "contact": body = <ContactPage navigate={navigate} />; break;
    case "privacy": body = <PrivacyPage navigate={navigate} />; break;
    case "aberdeen": body = <AberdeenAgencyPage navigate={navigate} />; break;
    default:        body = <V4Home navigate={navigate} />;
  }

  // For sub-pages we keep v4 nav/footer but legacy body. Force v4 colors.
  const isHome = route.page === "home";

  return (
    <React.Fragment>
      <div className="v4-ab">
        <span style={{ color: "var(--v4-ink-mute)" }}>Other versions →</span>
        <a href="Yann Hamonou Site.html">v1</a>
        <a href="Yann Hamonou Site v2.html">v2</a>
        <a href="Yann Hamonou Site v3.html">v3</a>
        <a className="is-active">v4 · Nava</a>
      </div>
      <V4Nav navigate={navigate} route={route} theme={theme} onToggleTheme={toggleTheme} />
      <main key={route.page + ":" + (route.slug || "")} className={isHome ? null : "v4-subpage"} style={isHome ? null : { background: "var(--paper)", color: "var(--ink)", paddingTop: 48 }}>
        {body}
      </main>
      <V4Footer navigate={navigate} />

      <TweaksPanel>
        <TweakSection label="Background" />
        <TweakRadio
          label="Theme"
          value={theme}
          options={["dark", "light"]}
          onChange={(v) => setTheme(v)}
        />
        {theme === "light" && (
          <TweakRadio
            label="Paper"
            value={paper}
            options={["warm", "cool", "bright"]}
            onChange={(v) => setPaper(v)}
          />
        )}
        <TweakSection label="Atmosphere" />
        <TweakToggle
          label="Smoke wisps"
          value={t.atmosphere}
          onChange={(v) => setTweak("atmosphere", v)}
        />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<V4App />);

Object.assign(window, { V4App, V4Home, V4Hero, V4Nav, V4Footer });
