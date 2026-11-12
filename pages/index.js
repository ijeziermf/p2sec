import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const value = email.trim()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

    if (!valid) {
      setStatus('error')
      setMessage("That email doesn't look right — check it and try again.")
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: value }),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('success')
        setMessage("You're on the list — the Roadmap is headed to " + value + ".")
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Connection error. Try again.')
    }
  }

  const title = 'Be Impactful From Day One in Cybersecurity | P2Sec'
  const description = 'The free 2027 Cyber Cert Roadmap from P2Sec. Certs mapped by job outcome, not difficulty. Start with Security+ and climb the ladder.'
  const url = 'https://p2sec.com/'
  const image = 'https://p2sec.com/headshot.jpg'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'P2Sec',
        url: url,
      },
      {
        '@type': 'Person',
        name: 'Ifeanyi Ijezie',
        jobTitle: 'Founder of P2Sec',
        worksFor: { '@type': 'Organization', name: 'P2Sec' },
      },
    ],
  }

  const msgClass =
    status === 'success' ? 'form-msg ok' : status === 'error' ? 'form-msg err' : 'form-msg'

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="color-scheme" content="light" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,560;9..144,640&family=Public+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <header className="topbar">
        <div className="wrap topbar-inner">
          <a className="wordmark" href="#">P2Sec</a>
          <span className="topbar-note">The 2027 Cyber Cert Roadmap — free</span>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <h1>Be <span className="hl">impactful</span> from day one in cybersecurity — even if you&apos;re starting from nothing.</h1>
              <p className="subhead">
                The free <strong>2027 Cyber Cert Roadmap</strong> from P2Sec. Certs mapped by job outcome, not difficulty.
                Start with <strong>Security+</strong>. Then climb the ladder — so you walk in ready to contribute, not just ready to interview.
              </p>
              <ul className="hero-points">
                <li><span className="dot"></span>Certs in job order</li>
                <li><span className="dot"></span>Built for beginners</li>
                <li><span className="dot"></span>Day-one impact, not just interviews</li>
              </ul>
            </div>

            <div className="signup" id="get-roadmap">
              <h2>Get the free Roadmap</h2>
              <p className="lead">Drop your email and the 2027 Cyber Cert Roadmap is on its way.</p>
              <form id="roadmap-form" noValidate onSubmit={handleSubmit}>
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  inputMode="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                />
                <button type="submit" disabled={status === 'loading' || status === 'success'}>
                  {status === 'loading' ? 'Sending…' : 'Get the free Roadmap'}
                </button>
                <p id="form-msg" className={msgClass} role="status" aria-live="polite">
                  {message}
                </p>
              </form>
              <p className="fineprint">Free. Plus a short 3-part email sequence to get you started.</p>
              <p className="consent">
                By signing up, you agree to the free roadmap plus a short 3-part email sequence. Unsubscribe anytime. We never sell or share your email.
              </p>
            </div>
          </div>
        </section>

        <section className="block">
          <div className="wrap">
            <div className="section-head">
              <h2>Who this is for</h2>
              <p>You don&apos;t need a head start. You need a path that&apos;s in the right order.</p>
            </div>
            <div className="fit-grid">
              <div className="fit-card">
                <span className="num">01</span>
                <p>Starting from little to nothing, or nothing at all</p>
              </div>
              <div className="fit-card">
                <span className="num">02</span>
                <p>Studied some cyber in college, or know the basics like hacking and DDoS, but not job-ready yet</p>
              </div>
              <div className="fit-card">
                <span className="num">03</span>
                <p>Curious or already interested, just don&apos;t know how to break in</p>
              </div>
            </div>
          </div>
        </section>

        <section className="block steps-band">
          <div className="wrap">
            <div className="section-head">
              <h2>How it works</h2>
              <p>Three steps. No guessing about what to study next.</p>
            </div>
            <div className="steps">
              <div className="step">
                <span className="step-num">1</span>
                <h3>Get the Roadmap</h3>
                <p>The free 2027 Cyber Cert Roadmap, sent straight to your inbox.</p>
              </div>
              <div className="step">
                <span className="step-num">2</span>
                <h3>Study it — certs in job order</h3>
                <p>Work through the certs in the order employers actually hire for, starting with Security+.</p>
              </div>
              <div className="step">
                <span className="step-num">3</span>
                <h3>Show up Day-One Impact ready</h3>
                <p>Walk in ready to contribute from your first day — not just ready to interview.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="block">
          <div className="wrap about-grid">
            <figure className="about-photo" style={{ margin: 0 }}>
              <img
                src="/headshot.jpg"
                alt="Ifeanyi Ijezie, founder of P2Sec"
              />
            </figure>
            <div className="about-copy">
              <h2>A few steps ahead, not ten years</h2>
              <p className="about-text">
                I&apos;m Ifeanyi Ijezie, founder of P2Sec — a working cybersecurity professional growing toward CISO.
                I&apos;m a few steps ahead of you, not ten years ahead. We grow together: discipline in the gym,
                skills to get hired, and work that actually matters on day one.
              </p>
              <ul className="grow-list">
                <li><span className="tick">✓</span>Discipline in the gym</li>
                <li><span className="tick">✓</span>Skills to get hired</li>
                <li><span className="tick">✓</span>Work that matters on day one</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="closing">
          <div className="wrap">
            <h2>Start where you are. Be ready on day one.</h2>
            <p>The Roadmap is free, and it starts with Security+. Everything after that is already mapped out for you.</p>
            <a className="cta-link" href="#get-roadmap">Get the free Roadmap</a>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap footer-inner">
          <span className="f-brand">P2Sec</span>
          <p>Built by Ifeanyi Ijezie, founder of P2Sec. Real experience. Real path. Impact from day one.</p>
        </div>
      </footer>
    </>
  )
}
