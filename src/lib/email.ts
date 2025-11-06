import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Configuration Error:', error);
  } else {
    console.log('✅ SMTP Server is ready to send emails');
  }
});

/**
 * Send OTP email to user
 * @param email - Recipient email address
 * @param otp - 6-digit OTP code
 * @param name - Recipient name (optional)
 * @returns Promise<boolean> - true if sent successfully
 */
export async function sendOTPEmail(
  email: string,
  otp: string,
  name?: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'ResumeBuilder <noreply@resumebuilder.com>',
      to: email,
      subject: '🔐 Your OTP Code - ResumeBuilder',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                          🎯 ResumeBuilder
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">
                          ${name ? `Hi ${name}! 👋` : 'Hello! 👋'}
                        </h2>
                        
                        <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                          Thank you for using ResumeBuilder! Your One-Time Password (OTP) for verification is:
                        </p>
                        
                        <!-- OTP Box -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                          <tr>
                            <td align="center" style="padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;">
                              <div style="font-size: 40px; font-weight: bold; letter-spacing: 8px; color: #ffffff; font-family: 'Courier New', monospace;">
                                ${otp}
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                          This OTP will expire in <strong>10 minutes</strong>. Please do not share this code with anyone.
                        </p>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px;">
                          <p style="margin: 0; color: #666666; font-size: 14px;">
                            <strong>⚠️ Security Tip:</strong> ResumeBuilder will never ask you for your OTP via email or phone. If you didn't request this code, please ignore this email.
                          </p>
                        </div>
                        
                        <p style="margin: 20px 0 0 0; color: #666666; font-size: 16px;">
                          Best regards,<br>
                          <strong>The ResumeBuilder Team</strong>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                        <p style="margin: 0; color: #999999; font-size: 14px;">
                          © 2024 ResumeBuilder. All rights reserved.
                        </p>
                        <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
                          This is an automated email, please do not reply.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
Hi ${name || 'there'}!

Your OTP code for ResumeBuilder is: ${otp}

This code will expire in 10 minutes.

Please do not share this code with anyone.

Best regards,
The ResumeBuilder Team

---
© 2024 ResumeBuilder. All rights reserved.
This is an automated email, please do not reply.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
}