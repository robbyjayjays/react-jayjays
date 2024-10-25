import pkg from 'pg';
import crypto from 'crypto';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.PORT || 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      // Check if the user exists
      const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = userResult.rows[0];

      if (!user) {
        return res.status(404).json({ error: 'Email not found' });
      }

      // Generate a unique reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 3600000); // Expires in 1 hour

      // Store the reset token and its expiration in the database
      await pool.query(
        'UPDATE users SET resetPasswordToken = $1, resetPasswordExpires = $2 WHERE email = $3',
        [resetToken, resetTokenExpires, email]
      );

      // Construct the reset password link
      const resetLink = `https://yourwebsite.com/reset-password?token=${resetToken}`;

      // Configure the email transport
      const transporter = nodemailer.createTransport({
        service: 'YourEmailService', // Replace with your email service, e.g., 'gmail'
        auth: {
          user: process.env.EMAIL_USER, // Your email address
          pass: process.env.EMAIL_PASSWORD, // Your email password
        },
      });

      // Email options
      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click this link to reset your password: ${resetLink}`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('Error sending password reset email:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
