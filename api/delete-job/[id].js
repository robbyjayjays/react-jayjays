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
  if (req.method === 'DELETE') {
    const jobId = req.query.id;  // Get the job ID from the URL query parameters (Vercel uses req.query for dynamic routing)

    try {
      // Query to delete the job by ID
      const result = await pool.query('DELETE FROM jobs WHERE id = $1', [jobId]);
      
      // Check if the job was found and deleted
      if (result.rowCount === 0) {
        return res.status(404).send('Job not found'); // Return 404 if job not found
      }

      // Successfully deleted, send back no content
      res.status(204).send();
      
    } catch (error) {
      console.error('Error deleting job:', error.message);
      res.status(500).send('Server error');
    }

  } else {
    // If the request is not a DELETE request, return a 405 (Method Not Allowed) status
    res.status(405).json({ message: 'Method not allowed' });
  }
}
