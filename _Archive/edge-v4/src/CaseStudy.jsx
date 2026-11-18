// Case Study layout — long-form, editorial. Plus a Work index.

const caseStudyDetails = {
  arnlea: {
    client: "Arnlea",
    industry: "B2B SaaS · Hazardous-area asset management",
    year: "Sept 2025",
    location: "Aberdeen, UK · Global reach",
    size: "10–50 employees",
    role: "Webflow rebuild + four-day SEO foundation",
    timeline: "6 weeks",
    services: ["Web Development", "SEO", "GEO", "Schema", "GA4"],
    headline: <>Driving inbound growth for <em>Arnlea</em> with a new website and SEO programme.</>,
    summary: "Arnlea provides ATEX inspection software and mobile asset management to global energy and industrial companies. We rebuilt their site in Webflow and laid a four-day SEO foundation — within a week, the flagship term ranked #3.",
    challenge: (
      <>
        <p>Arnlea's previous site was underperforming on every front. It lacked the SEO foundations to compete, delivered almost no organic traffic, and failed to capture inbound demand effectively despite a strong product story.</p>
        <p>With ambitions to grow inbound demand, Arnlea needed two things — a modern, SEO-ready website, and a framework for sustained growth that the in-house team could maintain.</p>
      </>
    ),
    kpis: [
      { v: "#3", l: "Google rank, target term — within 1 week of launch" },
      { v: "500%", l: "Increase in monthly organic visits" },
      { v: "100", l: "Monthly clicks from targeted search terms" },
      { v: "12", l: "Keywords ranking in the top 4–10 after a few months" },
    ],
    approach: [
      {
        kicker: "01",
        title: "Website redevelopment",
        body: (
          <>
            <p>I rebuilt the site in Webflow with three priorities: modern positioning, technical strength, and lead capture.</p>
            <ul className="content-list">
              <li><strong>Modern and SaaS-inspired</strong>, reflecting Arnlea's positioning as the leader in hazardous-area asset management.</li>
              <li><strong>Technically strong</strong>, with fast load times, security headers, and full mobile responsiveness.</li>
              <li><strong>Lead-focused</strong>, with clearer demo-request and contact pathways throughout the journey.</li>
              <li><strong>Tracked end-to-end</strong> with GA4, GTM, Microsoft Clarity, and ActiveCampaign integrated for full visibility into pipeline.</li>
            </ul>
          </>
        ),
      },
      {
        kicker: "02",
        title: "SEO phase one — four-day sprint",
        body: (
          <>
            <p>A focused four-day project laid the foundation for organic growth — designed so the in-house team could carry on from there.</p>
            <ul className="content-list">
              <li><strong>Measurement</strong> — GA4/GTM events for key business goals (demo, contact, brochure downloads) verified and tested.</li>
              <li><strong>Structured data</strong> — JSON-LD for Organisation, SoftwareApplication, Breadcrumbs and FAQs.</li>
              <li><strong>On-page</strong> — priority pages optimised for the chosen target keywords.</li>
              <li><strong>Topical mapping</strong> — a keyword-to-page map, plus three content briefs for future blog expansion.</li>
              <li><strong>Governance</strong> — a clear SEO backlog, 90-day roadmap and one-page monthly reporting template.</li>
            </ul>
          </>
        ),
      },
    ],
    next: "Arnlea has moved into a maintenance retainer — technical health monitored monthly, incremental improvements continued (Core Web Vitals, schema, CTR lifts, rotating page optimisation). The framework also allows rapid acceleration into growth mode with additional days when required.",
    quotes: [
      {
        q: "Thank you so much Yann for all your hard work on our new site. We are so pleased with how it's turned out — was a pleasure working with you.",
        who: "Jen Hughes",
        role: "Marketing Manager, Arnlea",
      },
      {
        q: "This is a HUGE upgrade on our previous website and will make a positive impact for Arnlea.",
        who: "Allan Merritt",
        role: "CEO, Arnlea",
      },
    ],
  },
  viewport3: {
    client: "Viewport3",
    industry: "Industrial 3D inspection & metrology",
    year: "2024",
    location: "Aberdeen, UK",
    size: "10–50 employees",
    role: "Market positioning & messaging system",
    timeline: "4 weeks",
    services: ["Positioning", "Messaging", "Sales enablement"],
    headline: <>Sharpening <em>Viewport3's</em> positioning for a crowded inspection market.</>,
    summary: "Viewport3 had a strong technical reputation but messaging that fit twenty competitors. We rebuilt the positioning around a single category point of view — and watched inbound demos climb.",
    challenge: (
      <>
        <p>Viewport3's tech was widely respected, but the website and sales deck read like the rest of the industry — a competent list of capabilities, with nothing that told a prospect why these people, here, now.</p>
        <p>The team wanted a positioning system the whole company could rally behind — not just a tagline.</p>
      </>
    ),
    kpis: [
      { v: "1", l: "Crisp category point of view" },
      { v: "3", l: "Differentiating message pillars" },
      { v: "+38%", l: "Inbound demo requests within six months" },
      { v: "5", l: "Sales-playbook updates shipped" },
    ],
    approach: [
      {
        kicker: "01",
        title: "Discovery",
        body: <p>Interviews with leadership, sales, two account managers and three customers. Competitor mapping across the top twelve players. Audit of inbound enquiries and lost-deal reasons.</p>,
      },
      {
        kicker: "02",
        title: "Positioning workshop",
        body: <p>Two working sessions to land the category point of view and three differentiating pillars. Tested message-market fit against the top three buyer objections.</p>,
      },
      {
        kicker: "03",
        title: "Rollout",
        body: <p>Website copy patterns, sales-deck rewrite, voice guide, and "sounds like / doesn't sound like" examples. Trained the BD team on the new pitch arc.</p>,
      },
    ],
    next: "Viewport3 has continued the relationship into a fractional marketing-leadership engagement — keeping the positioning sharp as the product roadmap expands into adjacent markets.",
    quotes: [
      {
        q: "For the first time, our pitch sounds like us — and prospects get it inside the first two minutes of the demo.",
        who: "Head of Sales",
        role: "Viewport3",
      },
    ],
  },
};

function WorkIndex({ navigate }) {
  const cases = window.SITE_DATA.cases;
  return (
    <div className="page-enter">
      <header style={{ paddingTop: "clamp(48px, 7vw, 96px)", paddingBottom: "clamp(48px, 6vw, 72px)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Breadcrumb items={["Work"]} navigate={navigate} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginTop: 28 }}>
            <h1 className="display" style={{ fontSize: "clamp(64px, 10vw, 160px)" }}>Selected <em>work.</em></h1>
            <p className="muted" style={{ maxWidth: 360, fontSize: 17 }}>
              A small set of case studies. Rome wasn't built in a day — and neither is a case-study library you can stand behind.
            </p>
          </div>
        </div>
      </header>

      <section className="block">
        <div className="wrap">
          {cases.map((c, i) => (
            <button key={c.slug} onClick={() => navigate({ page: "case", slug: c.slug })}
                    style={{
                      display: "grid",
                      gridTemplateColumns: i % 2 === 0 ? "1.1fr 1fr" : "1fr 1.1fr",
                      gap: 64,
                      alignItems: "center",
                      width: "100%",
                      padding: "56px 0",
                      borderTop: "1px solid var(--rule)",
                      textAlign: "left",
                    }} className="work-row">
              <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
                <Placeholder kind={"case · " + c.client.toLowerCase()} caption={c.industry.toLowerCase()} ratio="4/3" />
              </div>
              <div style={{ order: i % 2 === 0 ? 2 : 1 }}>
                <div className="mono" style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--accent-ink)" }}>
                  {String(i + 1).padStart(2, "0")} — {c.client}
                </div>
                <div className="mono muted" style={{ marginTop: 8, fontSize: 12 }}>{c.role} · {c.year}</div>
                <h2 className="display" style={{ fontSize: "clamp(32px, 4vw, 56px)", marginTop: 18 }}>
                  {c.headline}
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 28 }}>
                  {c.kpis.slice(0, 2).map((k, j) => (
                    <div key={j} style={{ borderTop: "1px solid var(--rule)", paddingTop: 14 }}>
                      <p className="display" style={{ fontSize: 32 }}>{k.v}</p>
                      <p className="mono muted" style={{ fontSize: 12, marginTop: 6, textWrap: "balance" }}>{k.l}</p>
                    </div>
                  ))}
                </div>
                <span className="link-arrow" style={{ marginTop: 28, display: "inline-flex" }}>Read case study <Arrow /></span>
              </div>
            </button>
          ))}

          {/* Coming soon */}
          <div style={{
            padding: "56px 0",
            borderTop: "1px solid var(--rule)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }} className="work-row">
            <div style={{
              aspectRatio: "4/3", border: "1px dashed var(--rule)",
              display: "grid", placeItems: "center",
              fontFamily: "var(--font-display)", fontStyle: "italic",
              fontSize: 32, color: "var(--ink-mute)",
            }}>
              Coming soon
            </div>
            <div>
              <div className="mono" style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-mute)" }}>
                03 — More
              </div>
              <h2 className="display" style={{ fontSize: "clamp(32px, 4vw, 56px)", marginTop: 18 }}>
                Rome wasn't built <em>in a day.</em>
              </h2>
              <p className="muted" style={{ marginTop: 20, fontSize: 18, maxWidth: 480 }}>
                Two more case studies are with clients for approval. In the meantime — happy to walk through similar engagements on a call.
              </p>
            </div>
          </div>
        </div>
        <style>{`
          .work-row:hover h2 { color: var(--accent-ink); }
          @media (max-width: 880px) {
            .work-row { grid-template-columns: 1fr !important; gap: 32px !important; }
            .work-row > * { order: unset !important; }
          }
        `}</style>
      </section>

      <ContactBlock navigate={navigate} />
    </div>
  );
}

function CaseStudyPage({ slug, navigate }) {
  const d = caseStudyDetails[slug] || caseStudyDetails.arnlea;
  const cases = window.SITE_DATA.cases;
  const ix = cases.findIndex(c => c.slug === slug);
  const next = cases[(ix + 1) % cases.length];

  return (
    <article className="page-enter">
      {/* Hero */}
      <header style={{ paddingTop: "clamp(40px, 6vw, 80px)", paddingBottom: "clamp(36px, 4vw, 56px)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Breadcrumb items={["Work", d.client]} navigate={navigate} />
          <div style={{ marginTop: 24 }}>
            <div className="mono" style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--accent-ink)" }}>
              Case Study · {d.year}
            </div>
            <h1 className="display" style={{ fontSize: "clamp(48px, 8vw, 140px)", marginTop: 24 }}>
              {d.headline}
            </h1>
            <p style={{ marginTop: 32, fontSize: 22, lineHeight: 1.45, maxWidth: 820 }}>
              {d.summary}
            </p>
          </div>

          {/* Meta strip */}
          <dl style={{
            marginTop: 64,
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 0,
            borderTop: "1px solid var(--rule)",
          }} className="cs-meta">
            {[
              ["Client", d.client],
              ["Industry", d.industry],
              ["Location", d.location],
              ["Engagement", d.role],
              ["Timeline", d.timeline],
            ].map(([k, v], i, arr) => (
              <div key={i} style={{
                padding: "20px 24px 20px 0",
                borderRight: (i < arr.length - 1) ? "1px solid var(--rule)" : "none",
                paddingLeft: i > 0 ? 24 : 0,
              }}>
                <dt className="eyebrow" style={{ marginBottom: 8 }}>{k}</dt>
                <dd className="mono" style={{ margin: 0, fontSize: 14 }}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <style>{`@media (max-width: 880px) { .cs-meta { grid-template-columns: 1fr 1fr !important; } .cs-meta > * { border-right: none !important; padding-left: 0 !important; padding-right: 16px !important; } }`}</style>
      </header>

      {/* Hero image */}
      <section style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div className="wrap">
          <Placeholder kind={"hero · " + d.client.toLowerCase()} caption={d.client.toLowerCase() + " · " + d.industry.split("·")[0].trim().toLowerCase()} ratio="16/9" />
        </div>
      </section>

      {/* Results KPI strip — dark */}
      <section className="block tight" style={{ background: "var(--ink)", color: "var(--paper)" }}>
        <div className="wrap">
          <div className="eyebrow" style={{ color: "color-mix(in oklch, var(--paper) 60%, transparent)" }}>
            ✶ The numbers
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${d.kpis.length}, 1fr)`,
            gap: 40,
            marginTop: 36,
          }} className="cs-kpi">
            {d.kpis.map((k, i) => (
              <div key={i} style={{ borderTop: "1px solid color-mix(in oklch, var(--paper) 25%, transparent)", paddingTop: 24 }}>
                <p className="display" style={{ fontSize: "clamp(44px, 5vw, 84px)" }}>{k.v}</p>
                <p className="mono" style={{ marginTop: 12, fontSize: 13, opacity: 0.7, textWrap: "balance" }}>{k.l}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media (max-width: 880px) { .cs-kpi { grid-template-columns: 1fr 1fr !important; } }`}</style>
      </section>

      {/* Body — challenge, approach */}
      <section className="block">
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 80 }} className="cs-body">
            <div>
              <section style={{ marginBottom: 64 }}>
                <div className="eyebrow" style={{ marginBottom: 18 }}>↳ The challenge</div>
                <h2 className="display" style={{ fontSize: "clamp(34px, 4vw, 56px)", marginBottom: 24 }}>What we were solving</h2>
                <div className="prose">{d.challenge}</div>
              </section>

              <section style={{ marginBottom: 64, borderTop: "1px solid var(--rule)", paddingTop: 56 }}>
                <div className="eyebrow" style={{ marginBottom: 18 }}>↳ The approach</div>
                <h2 className="display" style={{ fontSize: "clamp(34px, 4vw, 56px)", marginBottom: 32 }}>How we worked</h2>
                {d.approach.map((a, i) => (
                  <article key={i} style={{ paddingTop: 32, marginTop: 32, borderTop: i > 0 ? "1px solid var(--rule-soft)" : "none" }}>
                    <div className="mono" style={{ color: "var(--accent-ink)", fontSize: 13, marginBottom: 10 }}>{a.kicker}</div>
                    <h3 className="display" style={{ fontSize: "clamp(26px, 2.6vw, 36px)", marginBottom: 16 }}>{a.title}</h3>
                    <div className="prose">{a.body}</div>
                  </article>
                ))}
              </section>

              <section style={{ borderTop: "1px solid var(--rule)", paddingTop: 56 }}>
                <div className="eyebrow" style={{ marginBottom: 18 }}>↳ What's next</div>
                <h2 className="display" style={{ fontSize: "clamp(34px, 4vw, 56px)", marginBottom: 24 }}>The next chapter</h2>
                <p style={{ fontSize: 19, lineHeight: 1.6 }}>{d.next}</p>
              </section>
            </div>

            <aside style={{ position: "sticky", top: 96, alignSelf: "start", display: "flex", flexDirection: "column", gap: 32 }}>
              <div style={{ borderTop: "2px solid var(--ink)", paddingTop: 16 }}>
                <div className="eyebrow">— Services delivered</div>
                <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {d.services.map(s => <span key={s} className="tag">{s}</span>)}
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 16 }}>
                <div className="eyebrow">— Client</div>
                <p className="display" style={{ fontSize: 26, marginTop: 8 }}>{d.client}</p>
                <p className="mono muted" style={{ fontSize: 13, marginTop: 6 }}>{d.size}</p>
              </div>

              <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 16 }}>
                <button className="btn btn-ghost" onClick={() => navigate({ page: "home", scroll: "contact" })}>
                  Start a project <Arrow />
                </button>
              </div>
            </aside>
          </div>
          <style>{`
            @media (max-width: 880px) {
              .cs-body { grid-template-columns: 1fr !important; gap: 56px !important; }
              .cs-body aside { position: static !important; }
            }
          `}</style>
        </div>
      </section>

      {/* Quotes */}
      <section className="block" style={{ background: "color-mix(in oklch, var(--accent-wash) 50%, var(--paper))", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 36 }}>— Words from {d.client}</div>
          <div style={{ display: "grid", gridTemplateColumns: d.quotes.length > 1 ? "1fr 1fr" : "1fr", gap: 48 }} className="quote-row">
            {d.quotes.map((qu, i) => (
              <figure key={i} style={{ margin: 0 }}>
                <blockquote style={{ margin: 0 }}>
                  <p className="display" style={{ fontSize: "clamp(24px, 2.4vw, 32px)", lineHeight: 1.25 }}>
                    <span style={{ color: "var(--accent)" }}>“</span>{qu.q}<span style={{ color: "var(--accent)" }}>”</span>
                  </p>
                </blockquote>
                <figcaption style={{ marginTop: 24, borderTop: "1px solid var(--rule)", paddingTop: 14 }}>
                  <p className="mono" style={{ fontSize: 13 }}>{qu.who}</p>
                  <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>{qu.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <style>{`@media (max-width: 880px) { .quote-row { grid-template-columns: 1fr !important; } }`}</style>
        </div>
      </section>

      {/* Next case */}
      <section className="block tight">
        <div className="wrap">
          <button onClick={() => navigate({ page: "case", slug: next.slug })}
                  style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", textAlign: "left", padding: "32px 0" }}
                  className="next-case">
            <div>
              <div className="eyebrow">→ Next case study</div>
              <h3 className="display" style={{ fontSize: "clamp(40px, 5.5vw, 80px)", marginTop: 18 }}>{next.client}</h3>
              <p className="muted" style={{ marginTop: 18, fontSize: 17 }}>{next.role} · {next.year}</p>
            </div>
            <Placeholder kind={"case · " + next.client.toLowerCase()} caption={next.industry.toLowerCase()} ratio="4/3" />
          </button>
        </div>
        <style>{`
          .next-case:hover h3 { color: var(--accent-ink); }
          @media (max-width: 880px) { .next-case { grid-template-columns: 1fr !important; gap: 24px !important; } }
        `}</style>
      </section>

      <ContactBlock navigate={navigate} />
    </article>
  );
}

Object.assign(window, { CaseStudyPage, WorkIndex });
