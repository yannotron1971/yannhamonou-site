// Content Page template — used for service pages, about, etc.
// Editorial long-form layout with sidebar marginalia.

const contentPageData = {
  strategy: {
    breadcrumb: ["Services", "Marketing Strategy"],
    eyebrow: "Service · Strategy",
    title: <>Clear, practical <em>marketing strategy</em> for SMEs.</>,
    dek: "Strategy without the slide deck. We diagnose your market, pick the right battles, and ship a 90-day plan you can actually run from Monday morning.",
    meta: [
    ["Engagement", "4–6 weeks · then optional retainer"],
    ["Best for", "SMEs ready to grow inbound"],
    ["Starts at", "£500 / day"],
    ["Outcome", "A strategy you can execute"]],

    sections: [
    {
      head: "What you get",
      kicker: "01",
      body:
      <>
            <p>Strategy work is only useful if you can use it. Every engagement ends with a written, opinionated plan — not a 60-slide deck full of bullets.</p>
            <ul className="content-list">
              <li><strong>Positioning statement</strong> — a single paragraph the whole team can quote.</li>
              <li><strong>Three audience personas</strong> with the actual sales objections each one raises.</li>
              <li><strong>A channel mix</strong> with budget shape, not just a list of platforms.</li>
              <li><strong>A 90-day execution plan</strong> with owners, dates, and one metric per workstream.</li>
              <li><strong>One-page monthly reporting template</strong> tied to your business outcomes.</li>
            </ul>
          </>

    },
    {
      head: "How we work",
      kicker: "02",
      body:
      <>
            <p>I'll be in your slack channel, not behind a one-way mirror. Most weeks look like a 60-minute working session plus two or three written check-ins. Less ceremony, more shipping.</p>
            <p>Three phases, roughly six weeks:</p>
            <ol className="content-list ordered">
              <li>
                <strong>Diagnose.</strong> Interviews with you, sales, and three customers. Audit of analytics, paid accounts, CRM and the existing site. We surface the bottleneck — and where the easy wins hide.
              </li>
              <li>
                <strong>Decide.</strong> Working sessions to land on positioning, audience priorities and the one or two channels worth investing in this year. We park everything else, on purpose.
              </li>
              <li>
                <strong>Document.</strong> A short, opinionated strategy document. 90-day plan with named owners. KPIs that mean something. Then we get to work.
              </li>
            </ol>
          </>

    },
    {
      head: "Where it fits",
      kicker: "03",
      body:
      <>
            <p>Strategy is the foundation, not the deliverable. Once it's in place, the other services slot in cleanly — SEO targets the right keywords, paid spends behind the right pages, automation nurtures the right leads. The plan tells you what to do; the rest of the stack is how.</p>
          </>

    }],

    aside: {
      pull: "Strategy without execution is theatre. Most SMEs don't need more thinking — they need an opinionated plan, and someone to help ship it.",
      facts: [
      ["Avg. engagement", "4–6 weeks"],
      ["Deliverables", "5 documents"],
      ["Working hours", "Mostly async"],
      ["Industries", "B2B SaaS, services, tech"]]

    }
  },
  positioning: {
    breadcrumb: ["Services", "Market Positioning"],
    eyebrow: "Service · Positioning",
    title: <>Stand out with <em>clear, compelling</em> messages.</>,
    dek: "If your value-prop fits on twenty different competitors' websites, prospects can't tell you apart. We fix that — with a sharp category point of view and a messaging hierarchy your whole team can use.",
    meta: [
    ["Engagement", "3–4 weeks"],
    ["Best for", "Teams in crowded categories"],
    ["Starts at", "£500 / day"],
    ["Outcome", "A messaging system, not a tagline"]],

    sections: [
    { head: "Why positioning matters", kicker: "01",
      body: <><p>Positioning is the decision about which mental shelf you want your prospect to put you on, and what they expect to find there. Get it right and every later marketing decision gets faster.</p></> },
    { head: "Process", kicker: "02",
      body: <><p>Discovery workshop → competitor mapping → message testing → final hierarchy. Three documents you can hand to copywriters, sales, and the next agency you hire.</p></> },
    { head: "What you get", kicker: "03",
      body: <><ul className="content-list">
          <li>Category point of view (one paragraph).</li>
          <li>Three message pillars with proof points.</li>
          <li>Sales-deck and website copy patterns.</li>
          <li>"Sounds like / doesn't sound like" voice guide.</li>
        </ul></> }],

    aside: {
      pull: "Positioning isn't a tagline. It's the decision about which mental shelf you want to live on.",
      facts: [
      ["Avg. engagement", "3–4 weeks"],
      ["Workshops", "2"],
      ["Deliverables", "3 documents"]]

    }
  },
  seo: {
    breadcrumb: ["Services", "SEO & GEO"],
    eyebrow: "Service · SEO/GEO",
    title: <>Get found in Google. <em>And in AI search.</em></>,
    dek: "Search is splitting in two — classical ranking, and Generative Engine Optimisation for Perplexity, ChatGPT and Gemini. We build for both, with the technical foundations to compound over time.",
    meta: [
    ["Engagement", "From 4-day sprint"],
    ["Best for", "Sites with intent, low visibility"],
    ["Starts at", "£500 / day"],
    ["Outcome", "Compounding organic traffic"]],

    sections: [
    { head: "What's in scope", kicker: "01",
      body: <><ul className="content-list">
          <li>Technical SEO — Core Web Vitals, schema, internal linking.</li>
          <li>On-page — title, intent match, content structure.</li>
          <li>Topical mapping — keyword to page, not keyword to nothing.</li>
          <li>GEO — fact density, citation patterns, AI-readable structure.</li>
          <li>Reporting — one page a month, business-outcome metrics.</li>
        </ul></> },
    { head: "Why it's different now", kicker: "02",
      body: <><p>AI answers are eating zero-click queries. The good news: the same fundamentals — clear, fact-dense, well-structured content — that earn rank are also what get you cited by language models.</p></> }],

    aside: {
      pull: "The same fundamentals that earn rank are what get you cited by AI.",
      facts: [
      ["Fastest result", "#3 rank in 1 week (Arnlea)"],
      ["Avg. lift", "300–500% organic in 6mo"],
      ["Reporting", "Monthly, one page"]]

    }
  },
  paid: {
    breadcrumb: ["Services", "Paid Media"],
    eyebrow: "Service · Paid",
    title: <>Paid media, <em>tied to pipeline.</em></>,
    dek: "Google, LinkedIn, Microsoft and Meta — account architecture, creative iteration and measurement that closes the loop with your CRM. Not vanity clicks.",
    meta: [
    ["Engagement", "From 8 weeks"],
    ["Best for", "Teams with budget but no system"],
    ["Starts at", "£500 / day"],
    ["Outcome", "Predictable cost per opportunity"]],

    sections: [
    { head: "Setup", kicker: "01", body: <p>Clean account architecture, conversion API integration, CRM-tied attribution, and naming conventions you'll still understand in six months.</p> },
    { head: "Iterate", kicker: "02", body: <p>Two-week creative sprints. Test fewer, bigger variables. Kill what doesn't work — even when you love it.</p> }],

    aside: { pull: "Paid is a system, not a campaign.", facts: [["Channels", "Google, LinkedIn, Meta, Microsoft"], ["Reporting", "Weekly"]] }
  },
  web: {
    breadcrumb: ["Services", "Web Development"],
    eyebrow: "Service · Web",
    title: <>Websites that <em>convert visitors</em> into customers.</>,
    dek: "Webflow and WordPress builds with the information architecture, performance and lead-capture flows that actually move pipeline.",
    meta: [
    ["Engagement", "6–10 weeks"],
    ["Best for", "Teams outgrowing their site"],
    ["Starts at", "£500 / day"],
    ["Outcome", "Fast, indexable, conversion-ready"]],

    sections: [
    { head: "Sitemap & IA", kicker: "01", body: <p>We start with the journey, not the homepage. What does each audience need to see, in what order, to take the next step.</p> },
    { head: "Build & launch", kicker: "02", body: <p>Webflow for marketing-led teams, WordPress when content scale demands it. Either way: fast, indexable, and easy to update.</p> }],

    aside: { pull: "Your homepage is a hallway, not the destination.", facts: [["Stack", "Webflow / WordPress"], ["LCP target", "< 2s"]] }
  },
  automation: {
    breadcrumb: ["Services", "Marketing Automation"],
    eyebrow: "Service · Automation",
    title: <>Nurture leads <em>without the noise.</em></>,
    dek: "HubSpot, Microsoft Dynamics, Mailerlite — lifecycle flows, lead scoring and CRM hygiene that keep sales focused on real opportunity, not list-cleaning.",
    meta: [
    ["Engagement", "From 4 weeks"],
    ["Best for", "Teams with leads, no system"],
    ["Starts at", "£500 / day"],
    ["Outcome", "Sales gets the right leads"]],

    sections: [
    { head: "What we'll fix", kicker: "01",
      body: <><ul className="content-list">
          <li>Lead capture → CRM, with the right fields, every time.</li>
          <li>Scoring tied to intent signals, not arbitrary points.</li>
          <li>Lifecycle flows that respect the buyer's stage.</li>
          <li>Sales-marketing handoff your reps actually use.</li>
        </ul></> }],

    aside: { pull: "If your reps don't trust the lead score, the score is wrong.", facts: [["Platforms", "HubSpot · Dynamics · Mailerlite · n8n"]] }
  }
};

function Breadcrumb({ items, navigate }) {
  return (
    <div className="mono" style={{ fontSize: 12, letterSpacing: ".05em", color: "var(--ink-mute)" }}>
      <button onClick={() => navigate({ page: "home" })} style={{ color: "inherit" }}>Index</button>
      {items.map((it, i) =>
      <React.Fragment key={i}>
          <span style={{ margin: "0 10px" }}>/</span>
          <span style={{ color: i === items.length - 1 ? "var(--ink)" : "inherit" }}>{it}</span>
        </React.Fragment>
      )}
    </div>);

}

function ContentPage({ slug, navigate }) {
  const d = contentPageData[slug] || contentPageData.strategy;

  // Compute "Next service"
  const services = window.SITE_DATA.services;
  const ix = services.findIndex((s) => s.id === slug);
  const next = services[(ix + 1) % services.length];

  return (
    <article className="page-enter">
      {/* Hero block */}
      <header style={{ paddingTop: "clamp(40px, 6vw, 80px)", paddingBottom: "clamp(40px, 5vw, 64px)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Breadcrumb items={d.breadcrumb} navigate={navigate} />

          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "end" }} className="cp-head">
            <div className="eyebrow">{d.eyebrow}</div>
            <div>
              <h1 className="display" style={{ fontSize: "clamp(48px, 8vw, 132px)" }}>
                {d.title}
              </h1>
              <p style={{ marginTop: 32, fontSize: 22, lineHeight: 1.4, maxWidth: 720 }}>
                {d.dek}
              </p>
            </div>
          </div>

          {/* meta strip */}
          <dl style={{
            marginTop: 64,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
            borderTop: "1px solid var(--rule)"
          }} className="cp-meta">
            {d.meta.map(([k, v], i) =>
            <div key={i} style={{
              padding: "20px 24px 20px 0",
              borderRight: i < d.meta.length - 1 ? "1px solid var(--rule)" : "none",
              paddingLeft: i > 0 ? 24 : 0
            }}>
                <dt className="eyebrow" style={{ marginBottom: 8 }}>{k}</dt>
                <dd className="display" style={{ margin: 0, fontSize: 20 }}>{v}</dd>
              </div>
            )}
          </dl>
        </div>
        <style>{`
          @media (max-width: 880px) {
            .cp-head { grid-template-columns: 1fr !important; }
            .cp-meta { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
      </header>

      {/* Body with sidebar */}
      <section className="block">
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 80 }} className="cp-body">
            <div>
              {d.sections.map((s, i) =>
              <section key={i} style={{ paddingBottom: 56, marginBottom: 56, borderBottom: i < d.sections.length - 1 ? "1px solid var(--rule)" : "none" }}>
                  <div className="eyebrow" style={{ marginBottom: 18 }}>↳ {s.kicker} — {s.head}</div>
                  <h2 className="display" style={{ fontSize: "clamp(34px, 4vw, 56px)", marginBottom: 28 }}>{s.head}</h2>
                  <div className="prose">{s.body}</div>
                </section>
              )}
            </div>

            <aside style={{ position: "sticky", top: 96, alignSelf: "start", display: "flex", flexDirection: "column", gap: 32 }}>
              {d.aside.pull &&
              <blockquote style={{
                margin: 0,
                padding: "24px 0",
                borderTop: "2px solid var(--ink)",
                borderBottom: "1px solid var(--rule)"
              }}>
                  <p className="display" style={{ fontSize: 24, lineHeight: 1.2 }}>
                    <em style={{ color: "var(--accent)" }}>“</em>{d.aside.pull}<em style={{ color: "var(--accent)" }}>”</em>
                  </p>
                </blockquote>
              }
              {d.aside.facts &&
              <div>
                  <div className="eyebrow" style={{ marginBottom: 12 }}>— By the numbers</div>
                  <dl style={{ margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {d.aside.facts.map(([k, v], i) =>
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, borderTop: "1px solid var(--rule-soft)", paddingTop: 10 }}>
                        <dt className="mono muted" style={{ fontSize: 13 }}>{k}</dt>
                        <dd className="mono" style={{ fontSize: 13, margin: 0, textAlign: "right" }}>{v}</dd>
                      </div>
                  )}
                  </dl>
                </div>
              }
              <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 20 }}>
                <p className="muted" style={{ fontSize: 14, marginBottom: 14 }}>Considering this service?</p>
                <button className="btn btn-ghost" onClick={() => navigate({ page: "home", scroll: "contact" })}>Book a call <Arrow /></button>
              </div>
            </aside>
          </div>
          <style>{`
            .prose p { font-size: 19px; line-height: 1.6; margin-bottom: 20px; }
            .prose strong { font-weight: 500; }
            .content-list { padding-left: 0; margin: 0 0 20px; list-style: none; display: flex; flex-direction: column; gap: 14px; }
            .content-list li { position: relative; padding-left: 28px; font-size: 19px; line-height: 1.55; }
            .content-list li::before { content: "→"; position: absolute; left: 0; color: var(--accent); font-family: var(--font-mono); }
            .content-list.ordered { counter-reset: ol; }
            .content-list.ordered li::before { counter-increment: ol; content: counter(ol, decimal-leading-zero); font-size: 13px; top: 4px; color: var(--accent); letter-spacing: .05em; }
            @media (max-width: 880px) { .cp-body { grid-template-columns: 1fr !important; gap: 56px !important; } .cp-body aside { position: static !important; } }
          `}</style>
        </div>
      </section>

      {/* Service grid -> other services */}
      <section className="block tight" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 24 }}>— Other services</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }} className="other-grid">
            {services.filter((s) => s.id !== slug).slice(0, 3).map((s, i) =>
            <button key={s.id} onClick={() => navigate({ page: "content", slug: s.id })}
            style={{
              textAlign: "left",
              padding: "32px 32px 32px 0",
              borderRight: i < 2 ? "1px solid var(--rule)" : "none",
              paddingLeft: i > 0 ? 32 : 0
            }} className="other-card">
                <span className="mono muted" style={{ fontSize: 12 }}>{s.number}</span>
                <h3 className="display" style={{ fontSize: 28, marginTop: 8, marginBottom: 12 }}>{s.title}</h3>
                <p className="muted" style={{ fontSize: 15 }}>{s.lead}</p>
                <span className="link-arrow" style={{ marginTop: 18, display: "inline-flex" }}>Read <Arrow /></span>
              </button>
            )}
          </div>
        </div>
        <style>{`
          .other-card:hover h3 { color: var(--accent-ink); }
          @media (max-width: 880px) { .other-grid { grid-template-columns: 1fr !important; } .other-card { padding-left: 0 !important; padding-right: 0 !important; border-right: none !important; border-top: 1px solid var(--rule); } }
        `}</style>
      </section>

      <ContactBlock navigate={navigate} />
    </article>);

}

/* "About me" page — uses ContentPage-ish layout */
function AboutPage({ navigate }) {
  return (
    <article className="page-enter">
      <header style={{ paddingTop: "clamp(40px, 6vw, 80px)", paddingBottom: "clamp(40px, 5vw, 64px)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Breadcrumb items={["About"]} navigate={navigate} />
          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "end" }} className="cp-head">
            <div className="eyebrow">About — Yann Hamonou</div>
            <div>
              <h1 className="display" style={{ fontSize: "clamp(48px, 8vw, 132px)" }}>
                Twelve years <em>helping B2B teams</em> grow.
              </h1>
              <p style={{ marginTop: 32, fontSize: 22, lineHeight: 1.4, maxWidth: 720 }}>
                French-Scottish, Aberdeen-based. I work with founders and marketing directors who want senior expertise without the overhead of a senior hire.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="block">
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="cp-body">
            <Placeholder kind="portrait" caption="yann · 2025" ratio="4/5" />
            <div className="prose">
              <p>I'm a marketing consultant based in Stonehaven, just south of Aberdeen. For the last twelve years I've worked across in-house and consulting roles in B2B SaaS, industrial services, professional services and tech. I even ran a Cognac business for 7 years.</p>
              <p>My work blends strategy, SEO, paid media, web and automation into systems that compound. I'm hands-on: the same person who writes the strategy also helps you ship it.</p>
              <p>I work with marketing teams who want senior expertise without paying for a senior hire,  and with founders who need a thinking partner who also gets the work done.</p>
              <h3 className="display" style={{ fontSize: 32, marginTop: 32 }}>Beyond the work</h3>
              <p>Hill-walker, cyclist, amateur photographer, into music. Always near coffee. Available by phone, email or carrier pigeon, whichever suits.</p>
            </div>
          </div>
        </div>
      </section>

      <ContactBlock navigate={navigate} />
    </article>);

}

Object.assign(window, { ContentPage, AboutPage, Breadcrumb });