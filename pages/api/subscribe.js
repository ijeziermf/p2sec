import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const EMAIL_FROM = 'Ifeanyi @ P2Sec <onboarding@p2sec.com>'
const PDF_URL = 'https://p2sec.com/2027-cyber-cert-roadmap.pdf'

function emailFooter(email) {
  const unsubscribeUrl = `https://p2sec.com/api/unsubscribe?email=${encodeURIComponent(email)}`
  return `
    <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
      <p style="font-size: 13px; color: #666; line-height: 1.5; margin-bottom: 8px;">
        You signed up at p2sec.com for the free 2027 Cyber Cert Roadmap and a short
        3-part email sequence. We do not sell or share your email address.
      </p>
      <p style="font-size: 13px; color: #666;">
        Don't want these emails? <a href="${unsubscribeUrl}" style="color: #0066ff; text-decoration: underline;">Unsubscribe here</a>.
      </p>
    </div>
  `
}

function sendEmail({ to, subject, html, sendAt }) {
  const unsubscribeUrl = `https://p2sec.com/api/unsubscribe?email=${encodeURIComponent(to)}`
  const payload = {
    from: EMAIL_FROM,
    to,
    subject,
    html: html + emailFooter(to),
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  }

  if (sendAt) {
    payload.scheduledAt = sendAt
  }

  return resend.emails.send(payload)
}

// Day 0 welcome email — delivers the PDF link immediately
function sendWelcomeEmail(email) {
  return sendEmail({
    to: email,
    subject: "Your 2027 Cyber Cert Roadmap is here.",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
        <p style="font-size: 18px; font-weight: 700; margin-bottom: 16px;">You got it.</p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Here's the 2027 Cyber Cert Roadmap: every cert ranked by job outcome,
          Security+ first, no fluff. Bookmark it. Use it.
        </p>
        <a href="${PDF_URL}" style="display: inline-block; background: #00d4ff; color: #000; font-weight: 700; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; margin-bottom: 32px;">
          Download the Roadmap
        </a>
        <p style="font-size: 14px; color: #666; line-height: 1.5;">
          More coming: cert guides, career deep dives, and tool breakdowns from the
          stuff I actually use on the job.
        </p>
      </div>
    `,
  })
}

// Day 2 origin-story email
function sendDay2Email(email, sendAt) {
  return sendEmail({
    to: email,
    subject: 'How I actually got into cybersecurity (no guru stuff)',
    sendAt,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          People ask how I got into cybersecurity like it's some magic story. It isn't.
          I got Security+ because I needed a job. I got the next cert because the
          first one opened a door. I kept going because the work was interesting and
          the money was real.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          No bootcamp. No handouts. No "just do CTFs and figure it out" advice. Just
          certs, applied experience, and a roadmap I wish someone had handed me.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          That's what this is: the roadmap I built for myself, refined against real job
          listings, updated for 2027.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          More coming. Stay tuned.
        </p>
      </div>
    `,
  })
}

// Day 4 soft-pitch email — tees up future products without being salesy
function sendDay4Email(email, sendAt) {
  return sendEmail({
    to: email,
    subject: "What I'm building next (and why)",
    sendAt,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          The roadmap is the start. I've been putting together study guides, practice
          question banks, and career roadmaps for the certs that actually pay — the ones
          beyond Security+.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          They're not expensive courses. Think $5–25 study packs, actual use-it-anywhere
          PDFs, nothing that requires a subscription.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          If that sounds useful, you'll be the first to know when they drop. No hype.
          Just the stuff that helps.
        </p>
        <p style="font-size: 14px; color: #888;">
          Not interested? No hard feelings — you'll still get the free stuff.
        </p>
      </div>
    `,
  })
}

function isDuplicateContactError(error) {
  if (!error) return false
  if (error.statusCode === 409) return true
  if (error.status === 409) return true
  const message = String(error.message || '').toLowerCase()
  return message.includes('already exists') || message.includes('duplicate') || message.includes('conflict')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!audienceId) {
    return res.status(500).json({ error: 'Audience ID is not configured.' })
  }

  try {
    // Add to Resend audience. If the contact already exists, treat it as a duplicate
    // signup and skip the entire email sequence so we never double-send.
    let isNewContact = false
    try {
      await resend.contacts.create({
        audienceId,
        email: normalizedEmail,
        unsubscribed: false,
      })
      isNewContact = true
    } catch (contactError) {
      if (isDuplicateContactError(contactError)) {
        return res.status(200).json({ success: true, duplicate: true })
      }
      throw contactError
    }

    if (!isNewContact) {
      return res.status(200).json({ success: true, duplicate: true })
    }

    // Send welcome email immediately
    await sendWelcomeEmail(normalizedEmail)

    // Schedule day 2 and day 4 emails via Resend's scheduledAt field
    const now = new Date()
    const day2 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
    const day4 = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString()

    await sendDay2Email(normalizedEmail, day2)
    await sendDay4Email(normalizedEmail, day4)

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Subscribe error:', error)
    return res.status(500).json({ error: 'Failed to subscribe. Try again.' })
  }
}