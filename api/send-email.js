const PRACTICE_EMAIL = process.env.PRACTICE_EMAIL || 'sahrasaid845@gmail.com'
const PRACTICE_NAME = 'Anfa Counselling & Psychotherapy'

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}

function bookingConfirmationHtml({ fullName, service, modality, preferred_date, preferred_time }) {
  return `<p>Hi ${escapeHtml(fullName)},</p>
<p>Thanks for your booking request with ${PRACTICE_NAME}. Here's what you submitted:</p>
<ul>
  <li><strong>Service:</strong> ${escapeHtml(service)}</li>
  <li><strong>Modality:</strong> ${escapeHtml(modality)}</li>
  <li><strong>Preferred date:</strong> ${escapeHtml(preferred_date)}</li>
  <li><strong>Preferred time:</strong> ${escapeHtml(preferred_time)}</li>
</ul>
<p>We'll be in touch soon to confirm. If you have questions in the meantime, call (613) 791-0284.</p>`
}

function contactNotificationHtml({ fullName, email, subject, message }) {
  return `<p>New contact form submission:</p>
<ul>
  <li><strong>Name:</strong> ${escapeHtml(fullName)}</li>
  <li><strong>Email:</strong> ${escapeHtml(email)}</li>
  <li><strong>Subject:</strong> ${escapeHtml(subject)}</li>
</ul>
<p><strong>Message:</strong><br>${escapeHtml(message)}</p>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL

  if (!apiKey || !senderEmail) {
    console.error('Brevo is not configured: missing BREVO_API_KEY or BREVO_SENDER_EMAIL')
    res.status(500).json({ error: 'Email service is not configured' })
    return
  }

  const { type, payload } = req.body || {}
  if (!payload || typeof payload !== 'object') {
    res.status(400).json({ error: 'Missing payload' })
    return
  }

  let emailData
  if (type === 'booking') {
    if (!payload.email || !payload.fullName) {
      res.status(400).json({ error: 'Missing required booking fields' })
      return
    }
    emailData = {
      sender: { name: PRACTICE_NAME, email: senderEmail },
      to: [{ email: payload.email, name: payload.fullName }],
      subject: `Your booking request — ${PRACTICE_NAME}`,
      htmlContent: bookingConfirmationHtml(payload),
    }
  } else if (type === 'contact') {
    if (!payload.email || !payload.fullName) {
      res.status(400).json({ error: 'Missing required contact fields' })
      return
    }
    emailData = {
      sender: { name: PRACTICE_NAME, email: senderEmail },
      to: [{ email: PRACTICE_EMAIL, name: PRACTICE_NAME }],
      replyTo: { email: payload.email, name: payload.fullName },
      subject: `New contact message: ${payload.subject || '(no subject)'}`,
      htmlContent: contactNotificationHtml(payload),
    }
  } else {
    res.status(400).json({ error: 'Invalid email type' })
    return
  }

  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(emailData),
    })

    if (!brevoRes.ok) {
      const detail = await brevoRes.text()
      console.error('Brevo send failed:', brevoRes.status, detail)
      res.status(502).json({ error: 'Failed to send email' })
      return
    }

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Brevo request error:', err)
    res.status(502).json({ error: 'Failed to send email' })
  }
}
