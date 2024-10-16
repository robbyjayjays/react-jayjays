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
  if (req.method === 'PUT') {
    const jobId = req.query.id;  // Get the job ID from the URL query parameters (Vercel uses req.query for dynamic routing)
    const { title, type, location, description, salary, companyname, companydescription, contactemail, contactphone } = req.body;

    try {
      // Update the job record in the database
      const result = await pool.query(
        `UPDATE jobs
        SET title = $1, type = $2, location = $3, description = $4, salary = $5,
            companyname = $6, companydescription = $7, contactemail = $8, contactphone = $9
        WHERE id = $10`,
        [
          title,
          type,
          location,
          description,
          salary,
          companyname,            // Access company name
          companydescription,     // Access company description
          contactemail,           // Access company contact email
          contactphone,           // Access company contact phone
          jobId,                  // Job ID from the query parameters
        ]
      );

      // Check if the job was found and updated
      if (result.rowCount === 0) {
        return res.status(404).send('Job not found');
      }

      // Send a success response
      res.status(200).send('Job updated successfully');
      
    } catch (error) {
      console.error('Error updating job:', error.message);
      res.status(500).send('Server error');
    }

  } else {
    // If the request is not a PUT request, return a 405 (Method Not Allowed) status
    res.status(405).json({ message: 'Method not allowed' });
  }
}
