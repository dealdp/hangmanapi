const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/student.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS lorem (info TEXT)');
  const stmt = db.prepare('INSERT INTO lorem VALUES (?)');

  for (let i = 0; i < 10; i++) {
    stmt.run(`Ipsum ${i}`);
  }

  stmt.finalize();

  db.each('SELECT rowid AS id, info FROM lorem', (err, row) => {
    console.log(`${row.id}: ${row.info}`);
  });
});

app.get('/lorem', (req, res) => {
  const sql = 'SELECT * FROM lorem';

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Close the database connection when the server stops
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing the database:', err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});