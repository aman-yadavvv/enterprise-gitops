import nodemailer from 'nodemailer'

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

// Send email
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"SoleStyle" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.text
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('Email sending failed:', error)
    throw error
  }
}

// Send welcome email
export const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0ea5e9;">Welcome to SoleStyle!</h1>
      <p>Hi ${user.name},</p>
      <p>Thank you for joining SoleStyle. We're excited to have you on board!</p>
      <p>Start exploring our premium collection of sneakers and find your perfect pair.</p>
      <a href="${process.env.CLIENT_URL}/shop" 
         style="display: inline-block; padding: 12px 24px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
        Start Shopping
      </a>
      <p style="margin-top: 24px; color: #666; font-size: 14px;">
        If you have any questions, feel free to reply to this email.
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
        © ${new Date().getFullYear()} SoleStyle. All rights reserved.
      </p>
    </div>
  `

  return sendEmail({
    email: user.email,
    subject: 'Welcome to SoleStyle! 🎉',
    html
  })
}

// Send order confirmation
export const sendOrderConfirmation = async (order, user) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('')

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0ea5e9;">Order Confirmation</h1>
      <p>Hi ${user.name},</p>
      <p>Thank you for your order! We've received your order and are processing it.</p>
      
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Order Number:</strong> #${order._id}</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
      </div>

      <h3>Order Items</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f1f5f9;">
            <th style="padding: 8px; text-align: left;">Product</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 8px; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 8px; text-align: right;"><strong>$${order.totalPrice.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>

      <h3>Shipping Address</h3>
      <p style="background: #f8fafc; padding: 12px; border-radius: 8px;">
        ${order.shippingAddress.street}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
        ${order.shippingAddress.country}
      </p>

      <a href="${process.env.CLIENT_URL}/orders/${order._id}" 
         style="display: inline-block; padding: 12px 24px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
        View Order
      </a>
      
      <p style="margin-top: 24px; color: #666; font-size: 14px;">
        We'll notify you when your order is shipped.
      </p>
    </div>
  `

  return sendEmail({
    email: user.email,
    subject: `Order Confirmation #${order._id}`,
    html
  })
}

// Send password reset email
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0ea5e9;">Reset Your Password</h1>
      <p>Hi ${user.name},</p>
      <p>You requested to reset your password. Click the button below to reset it.</p>
      <a href="${resetUrl}" 
         style="display: inline-block; padding: 12px 24px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
        Reset Password
      </a>
      <p style="color: #666; font-size: 14px;">
        This link will expire in 1 hour. If you didn't request this, please ignore this email.
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
        © ${new Date().getFullYear()} SoleStyle. All rights reserved.
      </p>
    </div>
  `

  return sendEmail({
    email: user.email,
    subject: 'Reset Your Password',
    html
  })
}