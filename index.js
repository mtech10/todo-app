import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import { use } from 'react';
import { verify } from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = 5000;
const { Pool } = pg;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

pool.on('connect', () => {
  console.log('Successfully connected to the database!');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

app.get('/tasks', verifyToken, async (req, res) => {
  
  try {
    const { userId } = req.user.id;;
    const result = await pool.query(
      'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post('/new-task', verifyToken, async (req, res) => {
    
    try {
        const userId = req.user.id;
        const { title, description } = req.body;
        const result = await pool.query(
            'INSERT INTO todos (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
            [userId, title, description]
        );
        console.log('Task added successfully:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.patch('/complete-task/:id', verifyToken, async (req, res) => {
  
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE todos SET is_complete = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.patch('/uncomplete-task/:id', verifyToken, async (req, res) => {
  
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE todos SET is_complete = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.delete('/delete-task/:id', verifyToken, async (req, res) => {
  
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});