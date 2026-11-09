import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function unsubscribeHtml(email) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Unsubscribed</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #f7f7f7;
        color: #111;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        margin: 0;
        padding: 24px;
      }
      .card {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        max-width: 480px;
        padding: 40px;
        text-align: center;
      }
      h1 {
        font-size: 24px;
        margin: 0 0 16px;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
        color: #444;
        margin: 0 0 12px;
      }
      .email {
        font-weight: 600;
        color: #111;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>You've been unsubscribed.</h1>
      <p><span class="email">${email}</span> will no longer receive emails from P2Sec.</p>
      <p>Changed your mind? You can always sign up again at <a href="https://p2sec.com" style="color: #0066ff; text-decoration: underline;">p2sec.com</a>.</p>
    </div>
  </body>
</html>`
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed')
  }

  const rawEmail = Array.isArray(req.query.email) ? req.query.email[0] : req.query.email
  const email = typeof rawEmail === 'string'
    ? decodeURIComponent(rawEmail.trim()).toLowerCase()
    : ''

  if (!email || !email.includes('@')) {
    return res.status(400).send('Valid email required.')
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!audienceId) {
    return res.status(500).send('Audience ID is not configured.')
  }

  try {
    const { data: list } = await resend.contacts.list({ audienceId })
    const contacts = list?.data || []
    const contact = contacts.find((c) => c.email.toLowerCase() === email)

    if (contact?.id) {
      await resend.contacts.update({
        audienceId,
        id: contact.id,
        unsubscribed: true,
      })
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    return res.status(200).send(unsubscribeHtml(email))
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return res.status(500).send('Something went wrong. Please try again.')
  }
}
