import nodemailer from 'nodemailer'
import config from '../config'

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  resetLink: string,
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production', // true for 465, false for other ports
    auth: {
      user: 'hafij.alasad23@gmail.com',
      pass: 'ntrx oecc smft bonx',
    },
  })

  await transporter.sendMail({
    from: 'hafij.alasad23@gmail.com',
    to,
    subject: subject,
    text: 'Reset your password within 10 minutes.', // plain‑text body
    html: `<b>${text}${resetLink}</b>`, // HTML body
  })
}
