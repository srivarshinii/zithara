const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5008;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'customer',
  password: 'root',
  port: 5432,
});

app.get('/api/customer_data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer_data ORDER BY sno');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
