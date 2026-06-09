// Shared UI atoms — nav, footer, placeholders, etc.
const { useState, useEffect, useRef } = React;

function Arrow({ size = 14 }) {
  return (
    <svg className="arr" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

function PlusIcon({ open }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M5 12h14" />
      {!open && <path d="M12 5v14" />}
    </svg>
  );
}

function Brand({ onClick }) {
  return (
    <button className="brand" onClick={onClick} aria-label="Home">
      Yann<span className="dot">.</span><em>Hamonou</em>
    </button>
  );
}

function Caret({ open }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }}
         aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ServicesMenu({ active, slug, navigate, items }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Outside-click + Esc close
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef}
         style={{ position: "relative" }}>
      <button
        className={(active ? "is-active " : "") + "nav-svc-trigger"}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
      >
        Services <Caret open={open} />
      </button>

      <div className={"nav-menu" + (open ? " is-open" : "")}
           role="menu" aria-label="Services">
        <div className="nav-menu-inner">
          <div className="nav-menu-head">
            <span className="eyebrow">↳ Marketing consultancy</span>
            <button className="nav-menu-all"
                    onClick={() => { setOpen(false); navigate({ page: "content", slug: "strategy" }); }}>
              All services <Arrow size={12} />
            </button>
          </div>
          <ul className="nav-menu-list">
            {items.map(s => {
              const isCur = slug === s.id;
              return (
                <li key={s.id}>
                  <button role="menuitem"
                          className={"nav-menu-item" + (isCur ? " is-current" : "")}
                          onClick={() => { setOpen(false); navigate({ page: "content", slug: s.id }); }}>
                    <span className="nav-menu-num">{s.number}</span>
                    <span className="nav-menu-text">
                      <span className="nav-menu-title">{s.title}</span>
                      <span className="nav-menu-lead">{s.lead}</span>
                    </span>
                    <span className="nav-menu-arr"><Arrow size={14} /></span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Nav({ route, navigate }) {
  const services = window.SITE_DATA.services;

  const isActive = (id) => {
    if (id === "home")     return route.page === "home";
    if (id === "services") return route.page === "content";
    if (id === "work")     return route.page === "case" || route.page === "work";
    if (id === "blog")     return route.page === "blog" || route.page === "post";
    return false;
  };

  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <Brand onClick={() => navigate({ page: "home" })} />
        <div className="nav-links">
          <button className={isActive("home") ? "is-active" : ""}
                  onClick={() => navigate({ page: "home" })}>Index</button>
          <ServicesMenu active={isActive("services")}
                        slug={route.slug}
                        navigate={navigate}
                        items={services} />
          <button className={isActive("blog") ? "is-active" : ""}
                  onClick={() => navigate({ page: "blog" })}>Journal</button>
          <button className={isActive("work") ? "is-active" : ""}
                  onClick={() => navigate({ page: "work" })}>Work</button>
        </div>
        <button className="nav-cta" onClick={() => navigate({ page: "home", scroll: "contact" })}>
          Book a call <Arrow size={12} />
        </button>
      </div>
    </nav>
  );
}

function Footer({ navigate }) {
  const D = window.SITE_DATA;
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: 18 }}>
              Yann<span className="dot">.</span><em>Hamonou</em>
            </div>
            <p className="muted" style={{ maxWidth: 320, fontSize: 15 }}>
              Marketing consultant serving SMEs in Aberdeen, Aberdeenshire and across Scotland. Based in Stonehaven.
            </p>
            <p className="mono" style={{ marginTop: 18, fontSize: 13, color: "var(--ink-soft)" }}>
              {D.brand.phone}
            </p>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              {D.services.map(s => (
                <li key={s.id}><a onClick={() => navigate({ page: "content", slug: s.id })} style={{cursor:"pointer"}}>{s.title}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Site</h4>
            <ul>
              <li><a onClick={() => navigate({ page: "home" })} style={{cursor:"pointer"}}>Index</a></li>
              <li><a onClick={() => navigate({ page: "work" })} style={{cursor:"pointer"}}>Selected work</a></li>
              <li><a onClick={() => navigate({ page: "blog" })} style={{cursor:"pointer"}}>Journal</a></li>
              <li><a onClick={() => navigate({ page: "about" })} style={{cursor:"pointer"}}>About</a></li>
              <li><a onClick={() => navigate({ page: "home", scroll: "contact" })} style={{cursor:"pointer"}}>Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Elsewhere</h4>
            <ul>
              <li><a href="#" onClick={e=>e.preventDefault()}>LinkedIn ↗</a></li>
              <li><a href="#" onClick={e=>e.preventDefault()}>Substack ↗</a></li>
              <li><a href="#" onClick={e=>e.preventDefault()}>Email ↗</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <span>© 2025 Yann Hamonou. All rights reserved.</span>
          <span>Stonehaven — 57.04°N, 2.10°W</span>
        </div>
      </div>
    </footer>
  );
}

/* Subtly-striped placeholder. children are caption text (mono). */
function Placeholder({ kind = "image", caption, ratio = "4/3", style }) {
  return (
    <div className="ph" style={{ aspectRatio: ratio, ...style }}>
      <span className="ph-kind">{kind}</span>
      {caption && <span className="ph-label">{caption}</span>}
    </div>
  );
}

/* Section header with eyebrow + title */
function SectionHead({ eyebrow, title, lede, action }) {
  return (
    <div className="section-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
      </div>
      <div>
        <h2 className="display" style={{ fontSize: "clamp(36px, 4.6vw, 64px)" }}>
          {title}
        </h2>
        {lede && <p className="muted" style={{ marginTop: 18, fontSize: 18, maxWidth: 620 }}>{lede}</p>}
        {action && <div style={{ marginTop: 24 }}>{action}</div>}
      </div>
    </div>
  );
}

/* Tag/category chip */
function Tag({ children, active, onClick }) {
  return (
    <button className={"tag" + (active ? " active" : "")} onClick={onClick}>
      {children}
    </button>
  );
}

/* Accordion / FAQ item */
function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: "1px solid var(--rule)" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          padding: "28px 0",
          textAlign: "left",
        }}>
        <span className="display" style={{ fontSize: "clamp(22px, 2.2vw, 30px)" }}>{q}</span>
        <span style={{ flex: "0 0 auto", width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--ink)", display: "grid", placeItems: "center" }}>
          <PlusIcon open={open} />
        </span>
      </button>
      <div style={{
        display: "grid",
        gridTemplateRows: open ? "1fr" : "0fr",
        transition: "grid-template-rows .35s ease",
      }}>
        <div style={{ overflow: "hidden" }}>
          <p className="muted" style={{
            paddingBottom: open ? 28 : 0,
            paddingRight: 60,
            fontSize: 17,
            maxWidth: 720,
            transition: "padding .35s ease",
          }}>{a}</p>
        </div>
      </div>
    </div>
  );
}

/* Marquee — infinite scroll of client names */
function Marquee({ items }) {
  const row = (
    <div className="item" style={{ display: "flex", gap: 80 }}>
      {items.map((it, i) => <span key={i}>{it}</span>)}
    </div>
  );
  return (
    <div className="marquee">
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}

/* LogoMarquee — infinite scroll of placeholder client logos.
   Each LogoMark draws a varied geometric mark + the company name so the
   strip reads like a real wall of customer logos. Swap LogoMark for real
   <img>s when the assets land. */
function LogoMark({ name, variant }) {
  const initials = name
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // 6 visual variants so the strip feels like a wall of real logos
  let mark;
  switch (variant) {
    case 0: // filled square monogram
      mark = (
        <span className="lm-mark lm-mark-square" aria-hidden="true">
          <span className="lm-init">{initials}</span>
        </span>
      );
      break;
    case 1: // outline circle monogram
      mark = (
        <span className="lm-mark lm-mark-circle" aria-hidden="true">
          <span className="lm-init">{initials}</span>
        </span>
      );
      break;
    case 2: // stacked bars
      mark = (
        <svg className="lm-svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5"  width="18" height="3" />
          <rect x="3" y="11" width="12" height="3" />
          <rect x="3" y="17" width="6"  height="3" />
        </svg>
      );
      break;
    case 3: // chevron / triangle
      mark = (
        <svg className="lm-svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 19L12 5l9 14H3z" fill="none" strokeWidth="2" />
        </svg>
      );
      break;
    case 4: // ring + dot
      mark = (
        <svg className="lm-svg" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
      break;
    default: // ampersand-y mark
      mark = (
        <svg className="lm-svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 20L20 4" strokeWidth="2.5" fill="none" />
          <path d="M4 4L20 20" strokeWidth="2.5" fill="none" />
        </svg>
      );
  }

  return (
    <span className="logo-mark" title={`${name} — placeholder logo`}>
      {mark}
      <span className="lm-name">{name}</span>
    </span>
  );
}

function LogoMarquee({ items }) {
  return (
    <div className="logo-strip">
      <div className="logo-row">
        {items.map((it, i) => (
          <LogoMark key={i} name={it} variant={i % 6} />
        ))}
      </div>
    </div>
  );
}

/* Format date as "14 Oct 2025" */
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

Object.assign(window, {
  Arrow, PlusIcon, Caret, Brand, Nav, ServicesMenu, Footer, Placeholder, SectionHead, Tag, FaqItem, Marquee, LogoMarquee, LogoMark, fmtDate,
});
