import express from 'express';
import cors from 'cors';
import pkg from 'pg'; // Import the entire 'pg' package
const { Pool } = pkg; // Destructure Pool from the imported pg package

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for requests from your React frontend
app.use(express.json()); // Middleware to parse JSON bodies


// Set up the PostgreSQL connection
const pool = new Pool({
  user: 'postgres',       // Replace with your PostgreSQL username
  host: 'localhost',          // Host of your PostgreSQL database
  database: 'jayjays',        // Name of your PostgreSQL database
  password: 'newpassword', // Your PostgreSQL password
  port: 5433,                 // Default PostgreSQL port
});

// Check if the database connection is working
pool.connect((err, client, release) => {
    if (err) {
      console.error('Error connecting to the database:', err.stack);
    } else {
      console.log('Connected to PostgreSQL database');
    }
});

// API to get all jobs
// API to get all jobs
app.get('/jobs', async (req, res) => {
    try {
      // Query to get all jobs without a limit
      const result = await pool.query('SELECT * FROM jobs ORDER BY id DESC');
      res.json(result.rows); // Return all jobs
    } catch (error) {
      console.error('Error fetching jobs:', error.message);
      res.status(500).send('Server error');
    }
  });
  
app.post('/jobs', async (req, res) => {
    const { title, type, description, location, salary, companyname, companydescription, contactemail, contactphone } = req.body;
    console.log('Received job data:', req.body);
    try {
        const maxIdResult = await pool.query('SELECT MAX(id) FROM jobs');
        const newId = (maxIdResult.rows[0].max || 0) + 1; // Increment the max ID by 1

        const result = await pool.query(
            'INSERT INTO jobs (title, type, description, location, salary, companyname, companydescription, contactemail, contactphone, "id") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [title, type, description, location, salary, companyname, companydescription, contactemail, contactphone, newId]
        );

        res.status(201).json(result.rows[0]); // Send back the newly created job
    } catch (error) {
        console.error('Error adding job:', error.message);
        res.status(500).send('Server error');
    }
});

// Get by ID
app.get('/jobs/:id', async (req, res) => {
    const jobId = req.params.id; // Get the job ID from the URL parameters

    try {
        // Query the database to find the job by ID
        const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
        
        // Check if a job was found
        if (result.rows.length === 0) {
            return res.status(404).send('Job not found'); // Return 404 if job not found
        }
        
        res.json(result.rows[0]); // Return the specific job
    } catch (error) {
        console.error('Error fetching job by ID:', error.message);
        res.status(500).send('Server error');
    }
});

app.delete('/jobs/:id', async (req, res) => {
    const jobId = req.params.id; // Get the job ID from the URL parameters

    try {
        const result = await pool.query('DELETE FROM jobs WHERE id = $1', [jobId]);
        
        if (result.rowCount === 0) {
            return res.status(404).send('Job not found'); // Return 404 if job not found
        }

        res.status(204).send(); // Successfully deleted, send back no content
    } catch (error) {
        console.error('Error deleting job:', error.message);
        res.status(500).send('Server error');
    }
});

app.put('/jobs/:id', async (req, res) => {
    const jobId = req.params.id; // Get the job ID from the URL parameters
    const { title, type, location, description, salary, companyname, companydescription, contactemail, contactphone } = req.body;

    try {
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
                companyname, // Access company name
                companydescription, // Access company description
                contactemail, // Access company contact email
                contactphone, // Access company contact phone
                jobId,
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Job not found');
        }

        res.status(200).send('Job updated successfully');
    } catch (error) {
        console.error('Error updating job:', error.message);
        res.status(500).send('Server error');
    }
});

// get but only the 3 most recent 
app.get('/recent-jobs', async (req, res) => {
    try {
        // Query to get the 3 most recently added jobs ordered by ID descending
        const result = await pool.query('SELECT * FROM jobs ORDER BY id DESC LIMIT 3');
        res.json(result.rows); // Return the most recent jobs
    } catch (error) {
        console.error('Error fetching recent jobs:', error.message);
        res.status(500).send('Server error');
    }
});




// Start the server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
