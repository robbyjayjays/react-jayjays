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
    rejectUnauthorized: false,  // Adjust SSL settings for production as needed
  }
});

// Vercel serverless function handler
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, type, description, location, salary, companyname, companydescription, contactemail, contactphone } = req.body;
    
    console.log('Received job data:', req.body);
    
    try {
      // Query the database to get the maximum job ID
      const maxIdResult = await pool.query('SELECT MAX(id) FROM jobs');
      const newId = (maxIdResult.rows[0].max || 0) + 1;  // Increment the max ID by 1

      // Insert the new job into the database
      const result = await pool.query(
        'INSERT INTO jobs (title, type, description, location, salary, companyname, companydescription, contactemail, contactphone, "id") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [title, type, description, location, salary, companyname, companydescription, contactemail, contactphone, newId]
      );

      // Send back the newly created job
      res.status(201).json(result.rows[0]);

    } catch (error) {
      console.error('Error adding job:', error.message);
      res.status(500).send('Server error');
    }

  } else {
    // If the request is not a POST request, return a 405 (Method Not Allowed) status
    res.status(405).json({ message: 'Method not allowed' });
  }
}
