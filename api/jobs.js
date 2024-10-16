import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

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
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM jobs ORDER BY id DESC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching jobs:', error.message);
      res.status(500).send('Server error');
    }
  } else if (req.method === 'POST') {
    const { title, type, description, location, salary, companyname, companydescription, contactemail, contactphone } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO jobs (title, type, description, location, salary, companyname, companydescription, contactemail, contactphone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [title, type, description, location, salary, companyname, companydescription, contactemail, contactphone]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding job:', error.message);
      res.status(500).send('Server error');
    }
  }
}
