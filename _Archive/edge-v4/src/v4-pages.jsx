// v4 — additional real pages: Contact, Privacy Policy, Aberdeen Marketing Agency.
// Self-contained: reuses the legacy layout vocabulary (.wrap/.block/.prose/
// .display/.eyebrow/.btn/.tag/.muted/.mono) shared by the other sub-pages and the
// already-exported Breadcrumb helper, but defines its own form + section pieces so
// it has no dependency on Home.jsx (which isn't loaded on the v4 page).

const { useState: useStateVP } = React;

function VPArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 6, verticalAlign: "middle" }}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const vpFieldStyle = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--rule)",
  padding: "10px 0",
  fontFamily: "var(--font-body)",
  fontSize: 17,
  color: "var(--ink)",
  outline: "none",
  resize: "vertical",
  width: "100%",
};

function VPField({ label, value, onChange, placeholder, type = "text", textarea }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="eyebrow">{label}</span>
      {textarea ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={vpFieldStyle} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={vpFieldStyle} />
      )}
    </label>
  );
}

/* Shared contact form used by ContactPage and the Aberdeen landing page */
function V4ContactForm({ navigate }) {
  const [sent, setSent] = useStateVP(false);
  const [data, setData] = useStateVP({ name: "", email: "", company: "", goal: "growth", msg: "" });
  const onSubmit = (e) => { e.preventDefault(); setSent(true); };

  if (sent) {
    return (
      <div style={{ padding: 40, border: "1px solid var(--rule)", borderRadius: 16, background: "var(--v4-panel)", display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
        <div className="eyebrow">✶ Received</div>
        <h3 className="display" style={{ fontSize: "clamp(26px, 3vw, 40px)" }}>
          Thanks, {data.name || "there"}.<br />I'll be in touch within 24 hours.
        </h3>
        <p className="muted">In the meantime, a few <button className="link-arrow" onClick={() => navigate({ page: "blog" })}>recent notes from the journal</button> might be relevant.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ padding: 36, border: "1px solid var(--rule)", borderRadius: 16, background: "var(--v4-panel)", display: "flex", flexDirection: "column", gap: 22 }}>
      <VPField label="Name" value={data.name} onChange={(v) => setData({ ...data, name: v })} placeholder="Your name" />
      <VPField label="Email" type="email" value={data.email} onChange={(v) => setData({ ...data, email: v })} placeholder="you@company.co.uk" />
      <VPField label="Company" value={data.company} onChange={(v) => setData({ ...data, company: v })} placeholder="Company / org" />
      <div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>I'm looking for</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[["strategy", "Strategy"], ["growth", "Growth"], ["positioning", "Positioning"], ["website", "Website"], ["seo", "SEO/GEO"], ["ppc", "Google Ads"], ["content", "Content"]].map(([id, label]) => (
            <button type="button" key={id} className={"tag" + (data.goal === id ? " active" : "")} onClick={() => setData({ ...data, goal: id })}>{label}</button>
          ))}
        </div>
      </div>
      <VPField label="Brief" textarea value={data.msg} onChange={(v) => setData({ ...data, msg: v })} placeholder="A sentence or two on what's going on." />
      <button className="btn btn-primary" type="submit" style={{ alignSelf: "flex-start" }}>Send brief <VPArrow /></button>
    </form>
  );
}

/* Full closing contact section. Defined here (not Home.jsx, which the v4 page
   does not load) so every legacy sub-page that calls <ContactBlock> works. */
function ContactBlock({ navigate }) {
  return (
    <section className="block" id="contact" style={{ background: "var(--v4-panel)", borderTop: "1px solid var(--rule)" }}>
      <div className="wrap">
        <div className="vp-cb-grid">
          <div>
            <div className="eyebrow" style={{ marginBottom: 20 }}>Get in touch</div>
            <h2 className="display" style={{ fontSize: "clamp(40px, 5.5vw, 80px)" }}>
              Let's talk about <em>what's holding back your growth.</em>
            </h2>
            <p className="muted" style={{ marginTop: 28, fontSize: 18, maxWidth: 440 }}>
              Book a free 30-minute consultation. We'll diagnose the bottleneck and agree the smallest next step that moves the needle.
            </p>
            <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 0 }}>
              {[["Phone", "+44 (0) 785 3455816"], ["Location", "Stonehaven, Aberdeenshire"], ["Response", "Within 24h, weekdays"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--rule)", padding: "14px 0" }}>
                  <span className="mono muted" style={{ fontSize: 13 }}>{k}</span>
                  <span className="mono" style={{ fontSize: 13 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <V4ContactForm navigate={navigate} />
        </div>
      </div>
      <style>{`
        .vp-cb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: start; }
        @media (max-width: 880px) { .vp-cb-grid { grid-template-columns: 1fr; gap: 40px; } }
      `}</style>
    </section>
  );
}

/* ============================================================ */
/* CONTACT                                                       */
/* ============================================================ */

function ContactPage({ navigate }) {
  return (
    <article className="page-enter">
      <header style={{ paddingTop: "clamp(40px, 6vw, 80px)", paddingBottom: "clamp(36px, 4vw, 56px)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Breadcrumb items={["Contact"]} navigate={navigate} />
          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "end" }} className="cp-head">
            <div className="eyebrow">Contact — Free strategy review</div>
            <div>
              <h1 className="display" style={{ fontSize: "clamp(48px, 8vw, 124px)" }}>
                Let's talk about <em>your growth.</em>
              </h1>
              <p style={{ marginTop: 28, fontSize: 22, lineHeight: 1.4, maxWidth: 680 }}>
                Book a free 30-minute marketing strategy review. We'll find the bottleneck holding back your pipeline and agree the smallest next step that moves the needle — no obligation, no jargon.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="block" style={{ paddingBottom: "clamp(24px,3vw,40px)" }}>
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 24 }}>In this focused session, we'll</div>
          <div className="vp-points">
            {[
              ["Diagnose", "Pinpoint what's quietly costing you growth — across positioning, search, paid and conversion."],
              ["Prioritise", "Identify the one or two moves with the highest return for the effort right now."],
              ["Plan", "Leave with a clear, no-nonsense next step you can act on, whether or not we work together."],
            ].map(([h, b], i) => (
              <div key={i} className="vp-point">
                <span className="mono vp-num">{"0" + (i + 1)}</span>
                <h3 className="display" style={{ fontSize: 24, marginTop: 8 }}>{h}</h3>
                <p className="muted" style={{ marginTop: 8, fontSize: 16, lineHeight: 1.5 }}>{b}</p>
              </div>
            ))}
          </div>

          <div className="vp-direct">
            <a className="vp-direct-item" href="tel:+447853455816">
              <span className="eyebrow">Call</span>
              <span className="v">+44 (0) 785 3455816</span>
            </a>
            <a className="vp-direct-item" href="mailto:hello@yannhamonou.com">
              <span className="eyebrow">Email</span>
              <span className="v">hello@yannhamonou.com</span>
            </a>
            <a className="vp-direct-item" href="https://www.linkedin.com/in/yannhamonou/" target="_blank" rel="noopener noreferrer">
              <span className="eyebrow">LinkedIn</span>
              <span className="v">in/yannhamonou ↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="vp-contact-grid">
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Send a brief</div>
              <h2 className="display" style={{ fontSize: "clamp(32px, 4vw, 56px)", maxWidth: 440 }}>
                Tell me what's <em>going on.</em>
              </h2>
              <p className="muted" style={{ marginTop: 20, fontSize: 17, maxWidth: 420 }}>
                A sentence or two is plenty to start. I reply personally, usually within 24 hours on weekdays.
              </p>
            </div>
            <V4ContactForm navigate={navigate} />
          </div>
        </div>
      </section>

      <style>{`
        .vp-points { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .vp-num { font-size: 12px; color: var(--ink-mute); letter-spacing: .08em; }
        .vp-direct { margin-top: 56px; display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
        .vp-direct-item { display: flex; flex-direction: column; gap: 8px; padding: 24px 28px; border-left: 1px solid var(--rule); text-decoration: none; color: var(--ink); transition: background .2s; }
        .vp-direct-item:first-child { border-left: none; }
        .vp-direct-item:hover { background: var(--v4-panel); }
        .vp-direct-item .v { font-size: 20px; font-weight: 500; }
        .vp-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
        @media (max-width: 880px) {
          .vp-points { grid-template-columns: 1fr; gap: 28px; }
          .vp-direct { grid-template-columns: 1fr; }
          .vp-direct-item { border-left: none; border-top: 1px solid var(--rule); }
          .vp-direct-item:first-child { border-top: none; }
          .vp-contact-grid { grid-template-columns: 1fr; gap: 40px; }
        }
      `}</style>
    </article>
  );
}

/* ============================================================ */
/* PRIVACY POLICY                                                */
/* ============================================================ */

function PrivacyPage({ navigate }) {
  const sections = [
    ["Who we are", "This website is operated by Yann Hamonou, a marketing consultant based in Stonehaven, Aberdeenshire. If you have any questions about this policy or how your data is handled, contact hello@yannhamonou.com."],
    ["What we collect", "When you submit the contact form or book a strategy review, we collect the details you provide — typically your name, email address, company and a short brief. We also collect anonymous, aggregated analytics about how the site is used (pages viewed, approximate region, device type)."],
    ["How we use it", "Your contact details are used solely to respond to your enquiry and, if we agree to work together, to deliver the engagement. Analytics data is used to understand what's useful on the site and to improve it. We never sell or rent your data."],
    ["Analytics & cookies", "This site uses privacy-conscious analytics (GA4 and Microsoft Clarity) to measure traffic and improve content. You can refuse cookies in your browser settings; the site will still work. No advertising profiles are built from your visit."],
    ["Data retention", "Enquiry data is kept only as long as needed to respond and, where relevant, for the duration of an engagement plus a reasonable period for our records. You can ask us to delete your data at any time."],
    ["Your rights", "Under UK GDPR you have the right to access, correct, or delete the personal data we hold about you, and to object to or restrict its processing. To exercise any of these rights, email hello@yannhamonou.com and we'll respond within 30 days."],
    ["Third parties", "We use reputable processors for hosting, email and analytics. These providers process data on our behalf under their own GDPR-compliant terms. We do not share your information with third parties for marketing purposes."],
  ];
  return (
    <article className="page-enter">
      <header style={{ paddingTop: "clamp(40px, 6vw, 80px)", paddingBottom: "clamp(36px, 4vw, 56px)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Breadcrumb items={["Privacy Policy"]} navigate={navigate} />
          <div style={{ marginTop: 28 }}>
            <div className="eyebrow">Legal</div>
            <h1 className="display" style={{ fontSize: "clamp(44px, 7vw, 104px)", marginTop: 12 }}>
              Privacy <em>Policy</em>
            </h1>
            <p className="muted mono" style={{ marginTop: 20, fontSize: 13, letterSpacing: ".04em" }}>Last updated — January 2025</p>
          </div>
        </div>
      </header>

      <section className="block">
        <div className="wrap">
          <div className="vp-privacy">
            {sections.map(([h, b], i) => (
              <div key={i} className="vp-privacy-row">
                <h2 className="display" style={{ fontSize: 26 }}>{h}</h2>
                <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: 640 }}>{b}</p>
              </div>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 48, fontSize: 15 }}>
            Questions about your data?{" "}
            <button className="link-arrow" onClick={() => navigate({ page: "contact" })}>Get in touch</button>.
          </p>
        </div>
      </section>

      <style>{`
        .vp-privacy { display: flex; flex-direction: column; }
        .vp-privacy-row { display: grid; grid-template-columns: 1fr 2fr; gap: 48px; padding: 32px 0; border-top: 1px solid var(--rule); }
        .vp-privacy-row:first-child { border-top: none; padding-top: 0; }
        @media (max-width: 760px) { .vp-privacy-row { grid-template-columns: 1fr; gap: 12px; } }
      `}</style>
    </article>
  );
}

/* ============================================================ */
/* ABERDEEN MARKETING AGENCY (local landing page)                */
/* ============================================================ */

function AberdeenAgencyPage({ navigate }) {
  const services = window.SITE_DATA.services;
  const method = window.SITE_DATA.method;
  const reasons = [
    ["On-site, on-demand", "I can be in your boardroom within the hour — no endless Teams calls. Real conversations, faster decisions."],
    ["Local market knowledge", "Energy, engineering, tech and professional services all compete here. I know how buyers in the North-east actually search and decide."],
    ["Speed of execution", "Lean, senior, hands-on. From brief to a working SEO sprint in about a day — not a quarter."],
  ];
  const challenges = [
    ["Leads stuck at \u201cmaybe\u201d", "Prospects click Contact then vanish. Conversion-focused landing pages and remarketing that coax them back."],
    ["Invisible in search", "Competitors outrank you for the terms that matter. Local + technical SEO that earns durable visibility."],
    ["No clear ROI", "Reports look busy, the board still asks \u201cso what?\u201d GA4 and Looker Studio set-up that shows ROI in plain English."],
  ];
  return (
    <article className="page-enter">
      <header style={{ paddingTop: "clamp(48px, 7vw, 96px)", paddingBottom: "clamp(40px, 5vw, 72px)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Breadcrumb items={["Aberdeen Marketing Agency"]} navigate={navigate} />
          <div style={{ marginTop: 32 }}>
            <div className="eyebrow">For B2B SMEs · North-east Scotland</div>
            <h1 className="display" style={{ fontSize: "clamp(52px, 9vw, 148px)", lineHeight: 0.98, marginTop: 16 }}>
              Aberdeen <em>marketing agency</em> for B2B SMEs.
            </h1>
            <p style={{ marginTop: 28, fontSize: 22, lineHeight: 1.4, maxWidth: 720 }}>
              Data-driven strategies tailored to your business — local knowledge, senior expertise and a bias for speed of execution.
            </p>
            <div style={{ marginTop: 36, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={() => navigate({ page: "contact" })}>Book a free review <VPArrow /></button>
              <button className="btn" onClick={() => navigate({ page: "content", slug: "strategy" })}>My services</button>
            </div>
          </div>
        </div>
      </header>

      <section className="block">
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 28 }}>Why choose a local Aberdeen agency?</div>
          <div className="vp-ab-grid">
            {reasons.map(([h, b], i) => (
              <div key={i} className="vp-ab-card">
                <span className="mono vp-num">{"0" + (i + 1)}</span>
                <h3 className="display" style={{ fontSize: 26, marginTop: 10 }}>{h}</h3>
                <p className="muted" style={{ marginTop: 10, fontSize: 16, lineHeight: 1.55 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" style={{ background: "var(--v4-panel)", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 12 }}>How it works</div>
          <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 72px)", maxWidth: 820 }}>Challenges I solve for local SMEs</h2>
          <div className="vp-ab-grid" style={{ marginTop: 48 }}>
            {challenges.map(([h, b], i) => (
              <div key={i} className="vp-ab-card">
                <h3 className="display" style={{ fontSize: 22 }}>{h}</h3>
                <p className="muted" style={{ marginTop: 10, fontSize: 16, lineHeight: 1.55 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services from real site data */}
      <section className="block">
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 12 }}>What I do</div>
          <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 72px)", maxWidth: 820 }}>Your growth toolkit</h2>
          <div className="vp-svc-grid">
            {services.map((s) => (
              <button key={s.id} className="vp-svc" onClick={() => navigate({ page: "content", slug: s.id })}>
                <span className="mono vp-num">{s.number}</span>
                <h3 className="display" style={{ fontSize: 24, marginTop: 8 }}>{s.title}</h3>
                <p className="muted" style={{ marginTop: 8, fontSize: 15, lineHeight: 1.5 }}>{s.lead}</p>
                <span className="link-arrow" style={{ marginTop: 14 }}>Learn more <VPArrow /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement process from real site data */}
      <section className="block" style={{ background: "var(--v4-panel)", borderTop: "1px solid var(--rule)" }}>
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 12 }}>My engagement process</div>
          <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 72px)", maxWidth: 820 }}>A clear, repeatable path to growth.</h2>
          <div className="vp-method">
            {method.map((m) => (
              <div key={m.n} className="vp-method-step">
                <span className="mono vp-num">{m.n} · {m.tag}</span>
                <h3 className="display" style={{ fontSize: 26, marginTop: 10 }}>{m.title}</h3>
                <p className="muted" style={{ marginTop: 12, fontSize: 16, lineHeight: 1.55 }}>{m.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48 }}>
            <button className="btn btn-primary" onClick={() => navigate({ page: "contact" })}>Get started <VPArrow /></button>
          </div>
        </div>
      </section>

      <style>{`
        .vp-ab-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .vp-svc-grid { margin-top: 40px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--rule); border: 1px solid var(--rule); }
        .vp-svc { background: var(--v4-panel-2); display: flex; flex-direction: column; align-items: flex-start; text-align: left; padding: 28px; cursor: pointer; transition: background .2s; }
        .vp-svc:hover { background: var(--v4-panel-3); }
        .vp-method { margin-top: 48px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .vp-num { font-size: 12px; color: var(--ink-mute); letter-spacing: .08em; }
        @media (max-width: 880px) {
          .vp-ab-grid, .vp-svc-grid, .vp-method { grid-template-columns: 1fr; }
        }
      `}</style>
    </article>
  );
}

Object.assign(window, { ContactPage, PrivacyPage, AberdeenAgencyPage, ContactBlock });
