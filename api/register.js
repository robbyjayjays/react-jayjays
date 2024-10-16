// /api/register.js
import { Client } from 'pg';
import bcrypt from 'bcrypt'; // To hash the password

// Database connection
const client = new Client({
  connectionString: process.env.DATABASE_URL, // Make sure your Vercel DB connection URL is set in the environment
});

client.connect();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into the database
      const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email';
      const values = [email, hashedPassword];
      const result = await client.query(query, values);

      const newUser = result.rows[0];

      res.status(201).json({ message: 'User created', user: newUser });
    } catch (error) {
      console.error('Error inserting user:', error);
      res.status(500).json({ error: 'Error registering user' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
