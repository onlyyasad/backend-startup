import nodemailer from 'nodemailer'
import config from '../config'

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  resetLink: string,
) => {
  const transporter = nodemailer.createTransport({
    host: config.email_host,
    port: Number(config.email_port),
    secure: config.NODE_ENV === 'production', // true for 465, false for other ports
    auth: {
      user: config.email_user,
      pass: config.email_pass,
    },
  })

  await transporter.sendMail({
    from: config.email_user, // sender address
    to,
    subject: subject,
    text: 'Reset your password within 10 minutes.', // plain‑text body
    html: `<b>${text}${resetLink}</b>`, // HTML body
  })
}
