import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')
  const [imageError, setImageError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage("You're in. Check your inbox — the roadmap drops in the next few minutes.")
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

  return (
    <main style={styles.main}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <span style={styles.logo}>P2Sec</span>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          {/* Profile photo slot — drop public/headshot.jpg to replace the fallback */}
          <div style={styles.photoWrap}>
            {imageError ? (
              <div style={styles.photoPlaceholder} aria-label="Photo placeholder">
                <span style={styles.photoText}>P2Sec</span>
              </div>
            ) : (
              <img
                src="/headshot.jpg"
                alt="Ifeanyi Ijezie"
                style={styles.photoImg}
                onError={() => setImageError(true)}
              />
            )}
          </div>

          <h1 style={styles.headline}>
            Get the free 2027 Cyber Cert Roadmap
            <br />from a working cybersecurity professional.
          </h1>

          <p style={styles.subhead}>
            I mapped every certification that actually gets people hired, ranked by job
            outcome, not by how hard the test is. Start with Security+. Then climb the
            ladder. Straight from someone working in the field.
          </p>

          {/* Lead magnet form */}
          <div style={styles.formBox}>
            <p style={styles.formLabel}>Drop your email. Get the roadmap.</p>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                disabled={status === 'loading' || status === 'success'}
              />
              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...(status === 'success' ? styles.buttonSuccess : {}),
                  ...(status === 'loading' ? styles.buttonDisabled : {}),
                }}
                disabled={status === 'loading' || status === 'success'}
              >
                {status === 'loading' ? 'Sending…' : status === 'success' ? 'Sent ✓' : 'Get the Roadmap'}
              </button>
            </form>
            {message && (
              <p style={{
                ...styles.formMessage,
                color: status === 'error' ? '#ff6b6b' : '#4ade80',
              }}>
                {message}
              </p>
            )}
            <p style={styles.consent}>
              By signing up, you agree to receive the free roadmap plus a short 3-part
              email sequence. Unsubscribe anytime. We never sell or share your email.
            </p>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section style={styles.proofStrip}>
        <p style={styles.proofText}>
          Built by a practicing cybersecurity professional. Real experience. Real certs.
          Real path.
        </p>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          &copy; {new Date().getFullYear()} P2Sec. All rights reserved.
        </p>
      </footer>
    </main>
  )
}

const styles = {
  main: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0f',
    color: '#f0f0f0',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    borderBottom: '1px solid #1a1a2e',
    padding: '20px 0',
  },
  headerInner: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '0 24px',
  },
  logo: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#00d4ff',
    letterSpacing: '-0.5px',
  },
  hero: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px',
  },
  heroContent: {
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
  },
  photoWrap: {
    marginBottom: '32px',
  },
  photoImg: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    objectFit: 'cover',
    display: 'block',
    margin: '0 auto',
    border: '2px solid #1a1a2e',
  },
  photoPlaceholder: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    fontSize: '32px',
    fontWeight: '700',
    color: '#fff',
  },
  photoText: {
    fontSize: '28px',
  },
  headline: {
    fontSize: 'clamp(26px, 5vw, 40px)',
    fontWeight: '800',
    lineHeight: '1.15',
    marginBottom: '20px',
    color: '#ffffff',
    letterSpacing: '-1px',
  },
  subhead: {
    fontSize: '17px',
    lineHeight: '1.65',
    color: '#9999aa',
    marginBottom: '40px',
  },
  formBox: {
    background: '#111122',
    border: '1px solid #1e1e3a',
    borderRadius: '16px',
    padding: '32px',
  },
  formLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#00d4ff',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  form: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  input: {
    flex: '1 1 220px',
    padding: '14px 18px',
    fontSize: '16px',
    background: '#0a0a1a',
    border: '1px solid #2a2a4a',
    borderRadius: '10px',
    color: '#fff',
    outline: 'none',
    minWidth: '0',
  },
  button: {
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'opacity 0.2s',
  },
  buttonDisabled: {
    opacity: '0.6',
    cursor: 'not-allowed',
  },
  buttonSuccess: {
    background: 'linear-gradient(135deg, #00c896 0%, #00a060 100%)',
    cursor: 'default',
  },
  formMessage: {
    marginTop: '12px',
    fontSize: '14px',
    textAlign: 'center',
  },
  consent: {
    marginTop: '14px',
    fontSize: '12px',
    color: '#555577',
    lineHeight: '1.5',
  },
  proofStrip: {
    padding: '24px',
    background: '#0d0d1a',
    borderTop: '1px solid #1a1a2e',
    textAlign: 'center',
  },
  proofText: {
    fontSize: '13px',
    color: '#666688',
    maxWidth: '520px',
    margin: '0 auto',
    lineHeight: '1.5',
  },
  footer: {
    padding: '20px 24px',
    textAlign: 'center',
    borderTop: '1px solid #1a1a2e',
  },
  footerText: {
    fontSize: '12px',
    color: '#444455',
  },
}