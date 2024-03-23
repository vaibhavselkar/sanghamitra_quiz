import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to PostgreSQL online database supabase
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL, // Use environment variable for connection string
    ssl: {
        rejectUnauthorized: false, // Add this line to allow connection over SSL
    },
});

client.connect();

app.get('/quiz1', async (req, res) => {
    try {
        const query = await client.query('SELECT * FROM quiz1');
        res.send(query.rows);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route to submit candidate name
app.post('/submit-name', async (req, res) => {
    try {
        console.log(req.body)

        const { candidateName, score } = req.body;

        await client.query('INSERT INTO CandidateScores (candidate_name, score) VALUES ($1, $2)', [candidateName, score]);
        res.status(200).send('Candidate name submitted successfully!');
    } catch (error) {
        console.error('Error submitting candidate name:', error);
        res.status(500).send('Internal Server Error');
    }
});


const port = 9999;

app.use(express.static('public')); // Serve static files from the public directory

app.listen(port, () => {
    console.log(`Connected to http://localhost:${port}`);
})
