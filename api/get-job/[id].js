import pkg from 'pg';  // Import the default export from 'pg'
const { Pool } = pkg;  // Destructure Pool from the default import
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.PORT || 5432,
  ssl: {
    rejectUnauthorized: false,  // Adjust SSL settings for production as necessary
  }
});

// Vercel serverless function handler
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const jobId = req.query.id;  // Get the job ID from the URL query parameters (Vercel uses req.query for dynamic routing)

    try {
      // Query the database to find the job by ID
      const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
      
      // Check if a job was found
      if (result.rows.length === 0) {
        return res.status(404).send('Job not found'); // Return 404 if job not found
      }

      // Return the specific job
      res.status(200).json(result.rows[0]);
      
    } catch (error) {
      console.error('Error fetching job by ID:', error.message);
      res.status(500).send('Server error');
    }

  } else {
    // If the request is not a GET request, return a 405 (Method Not Allowed) status
    res.status(405).json({ message: 'Method not allowed' });
  }
}
