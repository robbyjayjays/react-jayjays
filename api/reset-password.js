import pkg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

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
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    try {
      // Find the user by reset token and check if it's still valid
      const userResult = await pool.query(
        'SELECT * FROM users WHERE resetPasswordToken = $1 AND resetPasswordExpires > NOW()',
        [token]
      );
      const user = userResult.rows[0];

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update the user's password and clear the reset token fields
      await pool.query(
        'UPDATE users SET password = $1, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = $2',
        [hashedPassword, user.id]
      );

      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
