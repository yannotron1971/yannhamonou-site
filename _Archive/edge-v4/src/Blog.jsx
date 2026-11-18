// Blog index + Blog post layout.

function BlogPage({ navigate }) {
  const posts = window.SITE_DATA.posts;
  const cats = ["All", ...Array.from(new Set(posts.map(p => p.cat)))];
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  const filtered = posts.filter(p =>
    (cat === "All" || p.cat === cat) &&
    (q === "" || p.title.toLowerCase().includes(q.toLowerCase()) || p.dek.toLowerCase().includes(q.toLowerCase()))
  );

  const featured = filtered.find(p => p.featured) || filtered[0];
  const rest = filtered.filter(p => p.slug !== (featured && featured.slug));

  return (
    <div className="page-enter">
      {/* Masthead */}
      <header style={{ paddingTop: "clamp(48px, 7vw, 96px)", paddingBottom: "clamp(36px, 4vw, 56px)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Breadcrumb items={["Journal"]} navigate={navigate} />

          <div style={{
            marginTop: 28,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap"
          }}>
            <h1 className="display" style={{ fontSize: "clamp(64px, 10vw, 160px)", flex: "1 1 auto" }}>
              The <em>Journal.</em>
            </h1>
            <div style={{ flex: "0 0 auto" }}>
              <p className="muted" style={{ maxWidth: 360, fontSize: 17 }}>
                Field notes on B2B marketing strategy, SEO, AI-search and how Scottish SMEs are actually growing in 2025.
              </p>
              <div className="mono muted" style={{ marginTop: 14, fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase" }}>
                {posts.length} articles · updated monthly
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filter bar */}
      <div style={{
        position: "sticky", top: 72, zIndex: 5,
        background: "color-mix(in oklch, var(--paper) 92%, transparent)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--rule)",
      }}>
        <div className="wrap" style={{
          display: "flex", gap: 16, justifyContent: "space-between", alignItems: "center",
          padding: "16px 0", flexWrap: "wrap"
        }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {cats.map(c => (
              <Tag key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Tag>
            ))}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            borderBottom: "1px solid var(--rule)", paddingBottom: 4
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search articles"
                   style={{
                     border: "none", background: "transparent", outline: "none",
                     fontFamily: "var(--font-body)", fontSize: 14, width: 220, color: "var(--ink)",
                   }} />
          </div>
        </div>
      </div>

      {/* Featured */}
      {featured && (
        <section style={{ paddingTop: "clamp(48px, 6vw, 80px)" }}>
          <div className="wrap">
            <button onClick={() => navigate({ page: "post", slug: featured.slug })}
                    style={{ display: "block", width: "100%", textAlign: "left" }}
                    className="featured-card">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }} className="featured-grid">
                <Placeholder kind="featured article" caption={featured.cat.toLowerCase()} ratio="4/3" />
                <div>
                  <div className="eyebrow" style={{ color: "var(--accent)" }}>✶ Featured</div>
                  <div className="mono muted" style={{ marginTop: 12, fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase" }}>
                    {featured.cat} · {fmtDate(featured.date)} · {featured.readMin} min read
                  </div>
                  <h2 className="display" style={{ fontSize: "clamp(36px, 4.5vw, 68px)", marginTop: 18 }}>
                    {featured.title}
                  </h2>
                  <p className="muted" style={{ marginTop: 20, fontSize: 19, lineHeight: 1.5, maxWidth: 540 }}>
                    {featured.dek}
                  </p>
                  <span className="link-arrow" style={{ marginTop: 28, display: "inline-flex" }}>
                    Read article <Arrow />
                  </span>
                </div>
              </div>
            </button>
          </div>
        </section>
      )}

      {/* Index list */}
      <section className="block">
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--rule)" }}>
            — All articles ({filtered.length})
          </div>
          {rest.length === 0 ? (
            <p className="muted">No articles match this filter.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {rest.map((p, i) => (
                <li key={p.slug}>
                  <button onClick={() => navigate({ page: "post", slug: p.slug })}
                          style={{
                            width: "100%", textAlign: "left",
                            display: "grid",
                            gridTemplateColumns: "120px 100px 1fr 200px 40px",
                            gap: 32,
                            alignItems: "center",
                            padding: "28px 0",
                            borderTop: "1px solid var(--rule)",
                            transition: "padding .25s, background .25s",
                          }}
                          className="post-row">
                    <span className="mono muted" style={{ fontSize: 12 }}>
                      {fmtDate(p.date)}
                    </span>
                    <span>
                      <span className="tag">{p.cat}</span>
                    </span>
                    <span className="display" style={{ fontSize: "clamp(20px, 2vw, 28px)" }}>
                      {p.title}
                    </span>
                    <span className="muted" style={{ fontSize: 14, textWrap: "balance" }}>
                      {p.dek.slice(0, 80)}{p.dek.length > 80 ? "…" : ""}
                    </span>
                    <span style={{ justifySelf: "end" }}><Arrow /></span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Newsletter strip */}
      <section className="block tight" style={{
        background: "var(--ink)", color: "var(--paper)"
      }}>
        <div className="wrap news-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <div className="eyebrow" style={{ color: "color-mix(in oklch, var(--paper) 60%, transparent)" }}>
              ✶ The Quiet Engine
            </div>
            <h3 className="display" style={{ fontSize: "clamp(32px, 4vw, 56px)", marginTop: 14 }}>
              One short, useful note <em>per month.</em>
            </h3>
            <p style={{ marginTop: 14, opacity: 0.7, maxWidth: 480 }}>
              No newsletter funnels. Just practical things I've learned that month, with the data.
            </p>
          </div>
          <form onSubmit={e => { e.preventDefault(); alert("Thanks — you're on the list."); }}
                style={{ display: "flex", gap: 0, borderBottom: "1px solid color-mix(in oklch, var(--paper) 40%, transparent)" }}>
            <input type="email" placeholder="you@company.co.uk" required
                   style={{
                     flex: 1,
                     background: "transparent", border: "none", outline: "none",
                     color: "var(--paper)", padding: "14px 0", fontSize: 18,
                     fontFamily: "var(--font-body)"
                   }} />
            <button type="submit" style={{
              padding: "14px 18px", fontFamily: "var(--font-mono)", fontSize: 12,
              letterSpacing: ".08em", textTransform: "uppercase", color: "var(--paper)",
              display: "flex", alignItems: "center", gap: 8,
            }}>Subscribe <Arrow /></button>
          </form>
        </div>
      </section>

      <style>{`
        .post-row:hover { padding-left: 12px !important; padding-right: 12px !important; background: color-mix(in oklch, var(--accent-wash) 60%, transparent); }
        .featured-card:hover h2 { color: var(--accent-ink); }
        @media (max-width: 880px) {
          .featured-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .post-row { grid-template-columns: 100px 1fr 24px !important; }
          .post-row > :nth-child(2), .post-row > :nth-child(4) { display: none; }
          .news-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* Blog post — single-article reading view */
function BlogPost({ slug, navigate }) {
  const post = window.SITE_DATA.posts.find(p => p.slug === slug) || window.SITE_DATA.posts[0];
  const related = window.SITE_DATA.posts.filter(p => p.slug !== post.slug && p.cat === post.cat).slice(0, 3);
  const others = window.SITE_DATA.posts.filter(p => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="page-enter">
      <header style={{
        paddingTop: "clamp(48px, 7vw, 96px)",
        paddingBottom: "clamp(40px, 5vw, 64px)",
        borderBottom: "1px solid var(--rule)",
      }}>
        <div className="wrap">
          <Breadcrumb items={["Journal", post.cat]} navigate={navigate} />
          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "end" }} className="cp-head">
            <div>
              <div className="eyebrow">{post.cat}</div>
              <div className="mono muted" style={{ marginTop: 12, fontSize: 12 }}>
                {fmtDate(post.date)} · {post.readMin} min read
              </div>
            </div>
            <div>
              <h1 className="display" style={{ fontSize: "clamp(40px, 6vw, 96px)" }}>
                {post.title}
              </h1>
              <p style={{ marginTop: 28, fontSize: 22, lineHeight: 1.45, maxWidth: 760 }}>
                {post.dek}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="block">
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2.4fr 1fr", gap: 56 }} className="post-grid">

            {/* Left rail — meta */}
            <aside style={{ alignSelf: "start", position: "sticky", top: 96, display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <div className="eyebrow">By</div>
                <p style={{ marginTop: 8, fontSize: 17 }}>Yann Hamonou</p>
                <p className="muted" style={{ fontSize: 14 }}>Marketing Consultant</p>
              </div>
              <div>
                <div className="eyebrow">Filed under</div>
                <div style={{ marginTop: 8 }}><span className="tag">{post.cat}</span></div>
              </div>
              <div>
                <div className="eyebrow">Share</div>
                <div style={{ marginTop: 8, display: "flex", gap: 8, flexDirection: "column" }}>
                  <a href="#" onClick={e => e.preventDefault()} className="mono" style={{ fontSize: 13, color: "var(--ink-soft)" }}>↗ LinkedIn</a>
                  <a href="#" onClick={e => e.preventDefault()} className="mono" style={{ fontSize: 13, color: "var(--ink-soft)" }}>↗ Copy link</a>
                </div>
              </div>
            </aside>

            {/* Body */}
            <div className="prose-long">
              <Placeholder kind="hero · article" caption={post.cat.toLowerCase()} ratio="16/9" style={{ marginBottom: 44 }} />

              <p style={{ fontSize: 22, lineHeight: 1.5, marginBottom: 28 }}>
                <span style={{ float: "left", fontFamily: "var(--font-display)", fontSize: 72, lineHeight: 0.8, paddingTop: 8, paddingRight: 12, color: "var(--accent)" }}>
                  {post.title[0]}
                </span>
                {post.dek} It's the kind of thing every B2B marketing director in Aberdeen, Glasgow or Edinburgh has been asked about in the last three board meetings — and most of the answers being given are wrong.
              </p>

              <p>Below, the practical version: what to do this quarter, what to stop doing, and a handful of links to the underlying research.</p>

              <h2>The shift, in one paragraph</h2>
              <p>Search engines used to be ten blue links and a question mark. Today, an answer engine sits above those links, summarises three sources, and sends the click somewhere else — or nowhere at all. For B2B marketers this isn't an apocalypse; it's a reweighting. The fundamentals still apply. The mix changes.</p>

              <h2>Four pillars that hold up</h2>
              <ol className="content-list ordered">
                <li><strong>Inverted pyramid.</strong> Lead with the answer. The model is scanning for one. Save the narrative for after.</li>
                <li><strong>Machine-readable structure.</strong> Headings, lists, schema. Plain HTML survives the rewrite better than clever JavaScript components.</li>
                <li><strong>Fact density.</strong> Specific entities, statistics with sources, named tools. Vague writing doesn't get cited.</li>
                <li><strong>Conversational match.</strong> Write the way people ask — not the way press releases read.</li>
              </ol>

              <blockquote style={{
                margin: "40px 0", padding: "8px 0 8px 28px",
                borderLeft: "3px solid var(--accent)",
              }}>
                <p className="display" style={{ fontSize: 28, lineHeight: 1.25 }}>
                  Vague writing doesn't get cited. <em>Specific writing does.</em>
                </p>
              </blockquote>

              <h2>What this changes for SMEs</h2>
              <p>For a small marketing team, the temptation is to chase every new acronym — GEO, AEO, LLM-O — and rebuild the content stack. Don't. The compounding work is the same as it was three years ago: clear positioning, fact-dense pages, technically sound site, regular publishing cadence. The delta is small.</p>

              <p>The actual change is the briefing template you give your writers. Add three lines: "Lead with the answer. Cite specific entities. Match the question someone would ask out loud." That's it.</p>

              <h2>A small experiment to run this week</h2>
              <p>Take your top three converting pages. Open ChatGPT or Perplexity. Ask the question someone would ask before landing on those pages. If the answer doesn't mention you — or mentions a competitor — you've found this quarter's brief.</p>

              <hr className="rule rule-soft" style={{ margin: "48px 0" }} />

              <p className="muted" style={{ fontSize: 15 }}>
                Filed under <strong>{post.cat}</strong>, written from Stonehaven. Get monthly notes like this in <button className="link-arrow" onClick={() => navigate({ page: "blog" })}>The Quiet Engine</button>.
              </p>
            </div>

            {/* Right rail — TOC */}
            <aside style={{ alignSelf: "start", position: "sticky", top: 96 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>— On this page</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "The shift, in one paragraph",
                  "Four pillars that hold up",
                  "What this changes for SMEs",
                  "A small experiment to run this week",
                ].map((t, i) => (
                  <li key={i}>
                    <a href="#" onClick={e => e.preventDefault()} className="mono"
                       style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.4, display: "block" }}>
                      0{i+1} — {t}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <style>{`
            .prose-long h2 { font-family: var(--font-display); font-weight: 400; font-size: clamp(28px, 3vw, 40px); letter-spacing: -0.01em; margin: 48px 0 18px; line-height: 1.05; }
            .prose-long p { font-size: 19px; line-height: 1.7; margin-bottom: 22px; }
            .prose-long strong { font-weight: 500; }
            @media (max-width: 1024px) {
              .post-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
              .post-grid aside { position: static !important; }
            }
          `}</style>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="block tight" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="wrap">
            <div className="eyebrow" style={{ marginBottom: 24 }}>— More on {post.cat.toLowerCase()}</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(1, related.length)}, 1fr)`, gap: 40 }} className="related-grid">
              {related.map(r => (
                <button key={r.slug} onClick={() => navigate({ page: "post", slug: r.slug })}
                        style={{ textAlign: "left", display: "block" }} className="journal-card">
                  <Placeholder kind="article" caption={r.cat.toLowerCase()} ratio="4/3" />
                  <div className="mono muted" style={{ marginTop: 14, fontSize: 12 }}>{fmtDate(r.date)} · {r.readMin} min</div>
                  <h3 className="display" style={{ fontSize: 22, marginTop: 10 }}>{r.title}</h3>
                </button>
              ))}
            </div>
            <style>{`@media (max-width: 880px) { .related-grid { grid-template-columns: 1fr !important; } }`}</style>
          </div>
        </section>
      )}

      <ContactBlock navigate={navigate} />
    </article>
  );
}

Object.assign(window, { BlogPage, BlogPost });
