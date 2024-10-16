import pkg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const { Pool } = pkg; // Destructure Pool from pg

// Create a new connection pool using environment variables
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.PORT || 5432,
  ssl: {
    rejectUnauthorized: false, // Necessary for many cloud providers
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Validate the input data
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      // Hash the password using bcryptjs
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      const result = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
        [email, hashedPassword]
      );

      // Return the newly created user (without password)
      const newUser = result.rows[0];
      res.status(201).json({
        message: 'User successfully registered',
        user: { id: newUser.id, email: newUser.email },
      });
    } catch (error) {
      console.error('Error registering user:', error.message);
      res.status(500).send('Server error');
    }
  } else {
    // If the request method is not POST, return a 405 Method Not Allowed
    res.status(405).json({ message: 'Method not allowed' });
  }
}
